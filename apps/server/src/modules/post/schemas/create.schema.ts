import { z } from 'zod';

export const postCreateSchema = z.object({
  title: z.string('Title is required').min(1, 'Title is required'),
  content: z.string('Content is required').min(1, 'Content is required'),
  images: z.array(z.url('Invalid image URL'), 'Images must be an array of valid URLs'),
  createdBy: z.object(
    {
      id: z.string().min(1, 'User ID is required'),
      name: z.string().min(1, 'User name is required'),
    },
    'Created By is required',
  ),
});

export type PostCreateInput = z.infer<typeof postCreateSchema>;
