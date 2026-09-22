import { generateText, smoothStream, stepCountIs, streamText } from 'ai';
import type { LLMProvider, LLMStreamArgs } from './interface.js';
import { google } from '@ai-sdk/google';
import { toolRegistry } from '../tools/registry.js';
import { buildSystemPrompt } from '../prompts/system-prompt.js';
import { createStreamEventCallbacks } from './stream-events.js';

export class GoogleLLMProvider implements LLMProvider {
  private async getResult(args: { model: string; input: string }) {
    const result = await generateText({
      model: google(args.model),
      system: buildSystemPrompt(),
      prompt: args.input,
      tools: toolRegistry,
      temperature: 0.4,
      stopWhen: stepCountIs(5),
    });
    return result;
  }
  async generateTextResponse(args: { model: string; input: string }) {
    const result = await this.getResult(args);
    return result.text;
  }

  streamResponse(args: LLMStreamArgs) {
    const result = streamText({
      model: google(args.model),
      system: buildSystemPrompt(),
      prompt: args.input,
      tools: toolRegistry,
      temperature: 0.4,
      stopWhen: stepCountIs(5),
      ...(args.abortSignal ? { abortSignal: args.abortSignal } : {}),
      onError: ({ error }) => {
        console.error('Gemini stream failed:', error);
      },
      ...createStreamEventCallbacks(args),
      experimental_transform: smoothStream({
        chunking: 'word',
        delayInMs: 30,
      }),
    });

    return result;
  }
}
