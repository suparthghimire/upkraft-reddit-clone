import type { Request, Response } from 'express';
import type { ChatRequestSchema } from '@reddit-clone/shared';
import { getProvider } from './llms/factory.js';
import { sendResponse } from '../../http/response/index.js';
import {
  createUIMessageStream,
  pipeUIMessageStreamToResponse,
  toUIMessageStream,
  type UIMessage,
  type UIMessageStreamWriterWithOutcome,
} from 'ai';
import type { ChatStreamEvent } from './llms/interface.js';

type ChatUIMessage = UIMessage<
  never,
  {
    event: ChatStreamEvent;
  }
>;

type ChatStreamWriter = UIMessageStreamWriterWithOutcome<ChatUIMessage>;

const MOCK_TITLES = [
  'How Semantic Search Finds Related Posts',
  'Building a Reliable Knowledge Base for RAG',
  'Streaming Tool Status Updates to the Frontend',
];

function isMockStream(value: unknown) {
  return value === 'true' || value === '1';
}

function waitForMockStep(milliseconds: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, milliseconds);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timeout);
        resolve();
      },
      { once: true },
    );
  });
}

async function streamMockResponse(
  writer: ChatStreamWriter,
  emit: (event: ChatStreamEvent) => void,
  input: string,
  signal: AbortSignal,
) {
  emit({ state: 'think', response: 'Attempting to search the knowledge base' });
  await waitForMockStep(250, signal);
  if (signal.aborted) return;

  emit({ state: 'tool', response: 'Searching the knowledge base' });
  await waitForMockStep(400, signal);
  if (signal.aborted) return;

  emit({
    state: 'tool',
    response: `Found ${MOCK_TITLES.length} relevant blogs`,
    titles: MOCK_TITLES,
  });
  await waitForMockStep(350, signal);
  if (signal.aborted) return;

  emit({ state: 'think', response: 'Drafting response' });
  await waitForMockStep(350, signal);
  if (signal.aborted) return;

  emit({ state: 'response', response: 'Sending response' });

  const textId = 'mock-response';
  const responseText = `This is a mock response for “${input}”. The stream exercised the thinking, knowledge-base search, result summary, and incremental message states without calling an AI provider or spending tokens. The stream exercised the thinking, knowledge-base search, result summary, and incremental message states without calling an AI provider or spending tokens. The stream exercised the thinking, knowledge-base search, result summary, and incremental message states without calling an AI provider or spending tokens. The stream exercised the thinking, knowledge-base search, result summary, and incremental message states without calling an AI provider or spending tokens. The stream exercised the thinking, knowledge-base search, result summary, and incremental message states without calling an AI provider or spending tokens. The stream exercised the thinking, knowledge-base search, result summary, and incremental message states without calling an AI provider or spending tokens. The stream exercised the thinking, knowledge-base search, result summary, and incremental message states without calling an AI provider or spending tokens. The stream exercised the thinking, knowledge-base search, result summary, and incremental message states without calling an AI provider or spending tokens. The stream exercised the thinking, knowledge-base search, result summary, and incremental message states without calling an AI provider or spending tokens. The stream exercised the thinking, knowledge-base search, result summary, and incremental message states without calling an AI provider or spending tokens. The stream exercised the thinking, knowledge-base search, result summary, and incremental message states without calling an AI provider or spending tokens. The stream exercised the thinking, knowledge-base search, result summary, and incremental message states without calling an AI provider or spending tokens. The stream exercised the thinking, knowledge-base search, result summary, and incremental message states without calling an AI provider or spending tokens. The stream exercised the thinking, knowledge-base search, result summary, and incremental message states without calling an AI provider or spending tokens.`;
  writer.write({ type: 'text-start', id: textId });

  for (const word of responseText.split(/(?=\s)/)) {
    await waitForMockStep(35, signal);
    if (signal.aborted) return;

    writer.write({ type: 'text-delta', id: textId, delta: word });
  }

  writer.write({ type: 'text-end', id: textId });
}

function getChatStreamErrorMessage(error: unknown) {
  console.error('Chat stream failed:', error);

  return error instanceof Error && error.message
    ? error.message
    : 'The assistant could not complete this request.';
}

export async function chatStreamHandler(req: Request, res: Response) {
  const { model, message } = req.validatedBody as ChatRequestSchema;
  const mock = isMockStream(req.query.mock);
  const Provider = mock ? null : getProvider(model);
  const instance = Provider ? new Provider() : null;
  const abortController = new AbortController();

  res.once('close', () => {
    if (!res.writableEnded) abortController.abort();
  });

  const stream = createUIMessageStream<ChatUIMessage>({
    onError: getChatStreamErrorMessage,
    execute: async ({ writer }) => {
      writer.write({ type: 'start' });

      const emit = (event: ChatStreamEvent) => {
        writer.write({
          type: 'data-event',
          data: event,
          transient: true,
        });
      };

      if (mock) {
        await streamMockResponse(writer, emit, message, abortController.signal);
        return;
      }

      emit({ state: 'think', response: 'Attempting to search the knowledge base' });

      const result = instance!.streamResponse({
        model,
        input: message,
        abortSignal: abortController.signal,
        onEvent: emit,
      });

      writer.merge(
        toUIMessageStream({
          stream: result.stream,
          sendStart: false,
          onError: getChatStreamErrorMessage,
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

export async function chatTextHandler(req: Request, res: Response) {
  const { model, message } = req.validatedBody as ChatRequestSchema;
  const Provider = getProvider(model);

  const instance = new Provider();

  console.log('BEFORE RESPONSE');

  const response = await instance.generateTextResponse({
    input: message,
    model,
  });

  console.log('RESPONSE', response);

  return sendResponse({
    message: 'Generated!',
    res,
    statusCode: 200,
    data: response,
  });
}
