import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  name: z.string().min(1, 'User name is required'),
});

export type User = z.infer<typeof userSchema>;
