import { z } from 'zod';

const openAIProviderSchema = z.object({
  provider: z.enum(['openai']),
  model: z.enum(['gpt-5.6-luna', 'gpt-6-luna']),
});

export type OpenAIProviderSchema = z.infer<typeof openAIProviderSchema>;

const providerSchema = z.discriminatedUnion('provider', [openAIProviderSchema]);

export type ProviderSchema = z.infer<typeof providerSchema>;

export type AvailableModelProvider = ProviderSchema['provider'];
export type AvailableModel = ProviderSchema['model'];

export const chatMessageSchema = z
  .object({
    reasoning: z.enum(['none', 'low', 'medium']),
    message: z.string('Message is required').min(1, 'Please enter a message'),
  })
  .and(providerSchema);

export type ChatMessageSchema = z.infer<typeof chatMessageSchema>;
export type ChatMessageInput = z.input<typeof chatMessageSchema>;

export const ModelToProviderMap: Record<AvailableModel, AvailableModelProvider> = {
  'gpt-5.6-luna': 'openai',
  'gpt-6-luna': 'openai',
};
