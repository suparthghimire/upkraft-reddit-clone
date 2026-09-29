import type { Request, Response } from 'express';
import type { ChatMessageSchema } from '@reddit-clone/shared';
import { getChatProvider } from './providers/factory.js';
import {
  createUIMessageStream,
  pipeUIMessageStreamToResponse,
  toUIMessageStream,
  type UIMessage,
} from 'ai';
import type { ChatEventArgs } from './providers/interface.js';
import { getOrCreateAIUsage } from '../user/services.js';

type UIMessageType = UIMessage<
  unknown,
  {
    event: ChatEventArgs;
  }
>;

function handleError(error: unknown) {
  console.log(error);
  return 'Something went wrong.';
}

export async function chatStreamHandler(req: Request, res: Response) {
  const { message, model, provider, reasoning } = req.validatedBody as ChatMessageSchema;
  const user = res.locals.user;
  const providerInstance = getChatProvider(provider);
  const abortController = new AbortController();

  res.once('close', () => {
    if (!res.writableEnded) abortController.abort();
  });

  const stream = createUIMessageStream<UIMessageType>({
    onError: handleError,
    execute: async ({ writer }) => {
      writer.write({
        type: 'start',
      });

      function emit(event: ChatEventArgs) {
        writer.write({
          type: 'data-event',
          data: event,
          transient: true,
        });
      }

      emit({ response: 'Attempting to search the knowledge base', state: 'think' });

      const result = providerInstance.streamMessage({
        message,
        model,
        provider,
        reasoning,
        onEvent: emit,
      });

      const usage = await result.usage;
      await getOrCreateAIUsage(user.id, usage);

      writer.merge(
        toUIMessageStream({
          stream: result.stream,
          sendStart: false,
          onError: handleError,
        }),
      );
    },
  });

  try {
    return await pipeUIMessageStreamToResponse({
      response: res,
      stream,
      headers: {
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    if (abortController.signal.aborted) return;

    if (!res.headersSent) throw error;

    res.destroy(error instanceof Error ? error : undefined);
  }
}
