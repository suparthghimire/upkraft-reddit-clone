import { z } from 'zod';

export const postUpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  images: z.array(z.url('Invalid image URL')).optional(),
  createdBy: z
    .object({
      id: z.string('Id is required').min(1, 'User ID is required'),
      name: z.string('Name is required').min(1, 'User name is required'),
    })
    .optional(),
});

export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
