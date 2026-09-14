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

export const PostResponseSchema = z.object({
    id: z.number("Id is required").min(1, "Id cannot be null"),
    title: z.string("Title is required").min(1, "Title is required"),
    content: z.string("Content is required").min(1, "Content is required"),
    slug: z.string("Slug is required"),
    created_at: z.string("Created at is required"),
    updated_at: z.string("Updated at is required")
})


export type PostResponse = z.infer<typeof PostResponseSchema>;

export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
