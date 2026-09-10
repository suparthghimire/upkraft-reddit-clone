import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  name: z.string().min(1, 'User name is required'),
});

export type User = z.infer<typeof userSchema>;

export const postCreateSchema = z.object({
  title: z.string('Title is required').min(1, 'Title is required'),
  content: z.string('Content is required').min(1, 'Content is required'),
  images: z.array(z.url('Invalid image URL'), 'Images must be an array of valid URLs'),
  createdBy: userSchema,
});

export type PostCreateInput = z.infer<typeof postCreateSchema>;

export const postUpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  images: z.array(z.url('Invalid image URL')).optional(),
  createdBy: userSchema.optional(),
});

export type PostUpdateInput = z.infer<typeof postUpdateSchema>;

export const postSchema = postCreateSchema.extend({
  id: z.string().min(1, 'Post ID is required'),
});

export type Post = z.infer<typeof postSchema>;

export type ApiResponse<T = unknown> = {
  message: string;
  statusCode: number;
  data: T | null;
};
