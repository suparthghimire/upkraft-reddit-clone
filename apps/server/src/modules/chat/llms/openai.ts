import { createOpenAI } from '@ai-sdk/openai';
import { generateText, smoothStream, stepCountIs, streamText } from 'ai';
import { env } from '../../../lib/env.schema.js';
import { buildSystemPrompt } from '../prompts/system-prompt.js';
import { toolRegistry } from '../tools/registry.js';
import type { LLMProvider, LLMStreamArgs } from './interface.js';
import { createStreamEventCallbacks } from './stream-events.js';

function getOpenAIModel(modelId: string) {
  const apiKey = env.OPENAI_API_KEY ?? env.OPEN_AI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured on the server.');
  }

  return createOpenAI({ apiKey })(modelId);
}

export class OpenAILLMProvider implements LLMProvider {
  private async getResult(args: { model: string; input: string }) {
    return generateText({
      model: getOpenAIModel(args.model),
      system: buildSystemPrompt(),
      prompt: args.input,
      tools: toolRegistry,
      temperature: 0.4,
      stopWhen: stepCountIs(5),
    });
  }

  async generateTextResponse(args: { model: string; input: string }) {
    const result = await this.getResult(args);
    return result.text;
  }

  streamResponse(args: LLMStreamArgs) {
    return streamText({
      model: getOpenAIModel(args.model),
      system: buildSystemPrompt(),
      prompt: args.input,
      tools: toolRegistry,
      temperature: 0.4,
      stopWhen: stepCountIs(5),
      ...(args.abortSignal ? { abortSignal: args.abortSignal } : {}),
      onError: ({ error }) => {
        console.error('OpenAI stream failed:', error);
      },
      ...createStreamEventCallbacks(args),
      experimental_transform: smoothStream({
        chunking: 'word',
        delayInMs: 30,
      }),
    });
  }
}
