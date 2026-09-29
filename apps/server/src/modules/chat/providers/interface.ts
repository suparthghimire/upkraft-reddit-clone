import type { ChatMessageSchema } from '@reddit-clone/shared';
import type { StreamTextResult } from 'ai';

export type StreamMessageArgs = ChatMessageSchema & {
  abortSignal?: AbortSignal;
};

export interface ChatProvider {
  streamMessage: (args: StreamMessageArgs) => StreamTextResult<any, any, any>;
}
