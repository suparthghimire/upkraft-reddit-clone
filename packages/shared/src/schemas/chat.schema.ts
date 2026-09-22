import z from 'zod';

export const chatModelSchema = z.enum(['gemini-3.6-flash', 'gpt-4.1-nano']);

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1, 'Message is required'),
  model: chatModelSchema.default('gemini-3.6-flash'),
});

export type ChatRequestSchema = z.infer<typeof chatRequestSchema>;
export type ChatModel = z.infer<typeof chatModelSchema>;
