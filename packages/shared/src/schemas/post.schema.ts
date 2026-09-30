import { z } from 'zod';

export const postCreateSchema = z.object({
  title: z.string('Title is required').min(1, 'Title is required'),
  content: z.string('Content is required').min(1, 'Content is required'),
  imageS3Keys: z.array(z.string()).optional(),
});

export type PostCreateInput = z.infer<typeof postCreateSchema>;

export const postUpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  imageS3Keys: z.array(z.string()).optional(),
});

export type PostUpdateInput = z.infer<typeof postUpdateSchema>;

export const postVoteSchema = z.object({
  voteType: z.enum(['upvote', 'downvote'], 'Vote type is required'),
});

export type PostVoteInput = z.infer<typeof postVoteSchema>;
