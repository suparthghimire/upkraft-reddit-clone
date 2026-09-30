import type { ChatMessageSchema } from '@reddit-clone/shared';
import { ai } from '@reddit-clone/shared';

export type ChatMessageState = 'think' | 'tool' | 'response';

export type ChatEventArgs = {
  state: ChatMessageState;
  response: string;
};

export type StreamMessageArgs = ChatMessageSchema & {
  abortSignal?: AbortSignal;
};

export interface ChatProvider {
  streamMessage: (args: StreamMessageArgs) => ai.StreamTextResult<any, any, any>;
}
