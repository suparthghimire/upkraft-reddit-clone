import { ai } from '@reddit-clone/shared';

export type ChatEvent = {
  state: 'think';
  response: string;
};

export type ChatUIMessage = ai.UIMessage<
  unknown,
  {
    event: ChatEvent;
  }
>;
