import { ai } from '@reddit-clone/shared';
import type { ChatProvider, StreamMessageArgs } from '../interface.js';
import { buildSystemPrompt } from '../../prompts/system-prompt.js';
import { toolRegistry } from '../../tools/registry.js';
import type { OpenAIProviderSchema } from '@reddit-clone/shared';
import { env } from '../../../../lib/env.schema.js';
import { CustomError } from '../../../../http/error/customError.js';
import { createOpenAI } from '@ai-sdk/openai';

export class OpenAIProvider implements ChatProvider {
  getOpenAIModel(modelId: OpenAIProviderSchema['model']) {
    if (!env.OPENAI_API_KEY) {
      throw new CustomError('OPENAI_API_KEY is not set in the environment', 401);
    }

    const openAIFn = createOpenAI({
      apiKey: env.OPENAI_API_KEY,
    });

    return openAIFn(modelId);
  }

  streamMessage(args: StreamMessageArgs) {
    return ai.streamText({
      model: this.getOpenAIModel(args.model),
      system: buildSystemPrompt(),
      reasoning: args.reasoning,
      providerOptions: {
        openai: {
          reasoningSummary: 'auto',
        },
      },
      prompt: args.message,
      tools: toolRegistry,
      temperature: 0.4,
      stopWhen: ai.stepCountIs(3),
      onError: ({ error }) => {
        console.error('An error occurred while streaming the message', error);
      },
    });
  }
}
