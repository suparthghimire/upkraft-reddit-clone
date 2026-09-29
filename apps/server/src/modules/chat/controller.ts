import type { Request, Response } from 'express';
import type { ChatEventArgs, ChatMessageSchema, ChatUIMessage } from '@reddit-clone/shared';
import { getChatProvider } from './providers/factory.js';
import { ai } from '@reddit-clone/shared';
import { getOrCreateAIUsage } from '../user/services.js';

function handleError(error: unknown) {
  console.log(error);
  return 'Something went wrong.';
}

export async function chatStreamHandler(req: Request, res: Response) {
  const { message, model, provider, reasoning } = req.validatedBody as ChatMessageSchema;
  const user = res.locals.user;
  const abortController = new AbortController();

  res.once('close', () => {
    if (!res.writableEnded) abortController.abort();
  });

  let persistUsage: (() => Promise<void>) | undefined;

  const stream = ai.createUIMessageStream<ChatUIMessage>({
    onError: handleError,
    onFinish: async () => {
      await persistUsage?.();
    },
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

      const providerInstance = getChatProvider(provider);

      emit({ state: 'think', response: 'Thinking through your question...' });

      const result = providerInstance.streamMessage({
        message,
        model,
        provider,
        reasoning,
      });

      persistUsage = async () => {
        const usage = await result.usage;
        await getOrCreateAIUsage(user.id, usage);
      };

      writer.merge(
        ai.toUIMessageStream({
          stream: result.stream,
          sendStart: false,
          sendReasoning: true,
          onError: handleError,
        }),
      );
    },
  });

  try {
    return await ai.pipeUIMessageStreamToResponse({
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
