import type { ChatModel } from '@reddit-clone/shared';
import { GoogleLLMProvider } from './google.js';
import { OpenAILLMProvider } from './openai.js';

export const getProvider = (modelId: ChatModel) => {
  switch (modelId) {
    case 'gemini-3.6-flash':
      return GoogleLLMProvider;
    case 'gpt-4.1-nano':
      return OpenAILLMProvider;
    default:
      throw new Error(`Unsupported model: ${modelId}`);
  }
};
