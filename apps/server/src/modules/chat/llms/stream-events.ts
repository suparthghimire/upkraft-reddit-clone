import type { LLMStreamArgs } from './interface.js';

function getTitles(output: unknown) {
  if (!Array.isArray(output)) return [];

  return output.flatMap((post) => {
    if (!post || typeof post !== 'object' || !('title' in post)) return [];

    const title = post.title;
    return typeof title === 'string' ? [title] : [];
  });
}

export function createStreamEventCallbacks(args: LLMStreamArgs) {
  let hasStartedResponse = false;
  const emit = (event: Parameters<NonNullable<LLMStreamArgs['onEvent']>>[0]) => {
    args.onEvent?.(event);
  };

  return {
    onStepStart: ({ stepNumber }: { stepNumber: number }) => {
      if (stepNumber > 0) {
        emit({ state: 'think', response: 'Drafting response' });
      }
    },
    onToolExecutionStart: ({ toolCall }: { toolCall: { toolName: string } }) => {
      if (toolCall.toolName === 'search_kb') {
        emit({ state: 'tool', response: 'Searching the knowledge base' });
      }
    },
    onToolExecutionEnd: ({
      toolCall,
      toolOutput,
    }: {
      toolCall: { toolName: string };
      toolOutput: { type: string; output?: unknown };
    }) => {
      if (toolCall.toolName !== 'search_kb' || toolOutput.type !== 'tool-result') return;

      const titles = getTitles(toolOutput.output);
      emit({
        state: 'tool',
        response: titles.length
          ? `Found ${titles.length} relevant blog${titles.length === 1 ? '' : 's'}`
          : 'No relevant blogs found',
        titles,
      });
    },
    onChunk: ({ chunk }: { chunk: { type: string; text?: string } }) => {
      if (chunk.type !== 'text-delta' || typeof chunk.text !== 'string') return;

      if (!hasStartedResponse) {
        hasStartedResponse = true;
        emit({ state: 'response', response: 'Sending response' });
      }

      emit({ state: 'message', response: chunk.text });
    },
  };
}
