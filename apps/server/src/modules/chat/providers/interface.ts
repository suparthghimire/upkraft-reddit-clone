import type { ChatMessageSchema } from '@reddit-clone/shared';
import type { StreamTextResult } from 'ai';

export type ChatMessageState = 'think' | 'tool' | 'response';

export type ChatEventArgs = {
  state: ChatMessageState;
  response: string;
};

export type StreamMessageArgs = ChatMessageSchema & {
  abortSignal?: AbortSignal;
  onEvent?: (state: ChatEventArgs) => void;
};

export interface ChatProvider {
  streamMessage: (args: StreamMessageArgs) => StreamTextResult<any, any, any>;
}
