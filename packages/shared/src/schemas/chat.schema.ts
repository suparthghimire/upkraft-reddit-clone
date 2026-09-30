import z from 'zod';

const openAIProviderSchema = z.object({
  provider: z.enum(['openai']),
  model: z.enum(['gpt-5.6-luna', 'gpt-6-luna']),
});

export type OpenAIProviderSchema = z.infer<typeof openAIProviderSchema>;

const providerSchema = z.discriminatedUnion('provider', [openAIProviderSchema]);

export const chatMessageSchema = z
  .object({
    reasoning: z.enum(['none', 'low', 'medium']),
    message: z.string('Message is required').min(1, 'Please enter a message'),
  })
  .and(providerSchema);

export const ModelToProviderMap = {
  'gpt-5.6-luna': 'openai',
  'gpt-6-luna': 'openai',
};

export type ChatMessageSchema = z.infer<typeof chatMessageSchema>;
