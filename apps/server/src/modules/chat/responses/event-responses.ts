import type { StreamMessageArgs } from '../providers/interface.js';

export function createStreamResponseEvent(args: StreamMessageArgs) {
  let hasStartedResponse = false;

  return {
    onStepStart: ({ stepNumber }: { stepNumber: number }) => {
      if (stepNumber > 0) {
        args.onEvent?.({ state: 'think', response: 'Creating a response' });
      }
    },
    onToolExecutionStart: ({ toolCall }: { toolCall: { toolName: string } }) => {
      if (toolCall.toolName === 'search_kb') {
        args.onEvent?.({ state: 'tool', response: 'Searching the knowledge base' });
      }
    },
    onToolExecutionEnd: ({ toolCall }: { toolCall: { toolName: string } }) => {
      if (toolCall.toolName !== 'search_kb') return;

      args.onEvent?.({
        state: 'tool',
        response: 'Found the information from the knowledge base',
      });
    },

    onChunk: ({ chunk }: { chunk: { type: string; text?: string } }) => {
      if (chunk.type !== 'text-delta' || typeof chunk.text !== 'string') return;

      if (!hasStartedResponse) {
        hasStartedResponse = true;
        args.onEvent?.({
          state: 'response',
          response: 'Sending response...',
        });
      }
    },
  };
}
