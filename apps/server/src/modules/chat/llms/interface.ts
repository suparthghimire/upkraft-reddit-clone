import type { StreamTextResult } from 'ai';

export type ChatStreamState = 'think' | 'tool' | 'response' | 'message';

export interface ChatStreamEvent {
  state: ChatStreamState;
  response: string;
  titles?: string[];
}

export interface LLMStreamArgs {
  model: string;
  input: string;
  abortSignal?: AbortSignal;
  onEvent?: (event: ChatStreamEvent) => void;
}

export interface LLMProvider {
  streamResponse: (args: LLMStreamArgs) => StreamTextResult<any, any, any>;
  generateTextResponse: (args: { model: string; input: string }) => Promise<string>;
}
