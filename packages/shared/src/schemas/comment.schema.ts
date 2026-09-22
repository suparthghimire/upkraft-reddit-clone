import z from 'zod';

export const createCommentSchema = z.object({
  text: z.string('Text is required').min(1, 'Text is required'),
  parentCommentId: z.number().optional(),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
