import { z } from 'zod';

export const postCreateSchema = z.object({
  title: z.string('Title is required').min(1, 'Title is required'),
  content: z.string('Content is required').min(1, 'Content is required'),
});

export type PostCreateInput = z.infer<typeof postCreateSchema>;

export const postUpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
