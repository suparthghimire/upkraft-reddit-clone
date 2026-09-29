import type { UIMessage, UIMessageChunk } from 'ai';

export type ChatMessageState = 'think' | 'tool';

export type ChatEventArgs = {
  state: ChatMessageState;
  response: string;
};

export type ChatUIMessage = UIMessage<
  unknown,
  {
    event: ChatEventArgs;
  }
>;

export type ChatUIMessageChunk = UIMessageChunk<ChatUIMessage>;

export type ChatEventPart = Extract<
  ChatUIMessage['parts'][number],
  { type: 'data-event' }
>;
