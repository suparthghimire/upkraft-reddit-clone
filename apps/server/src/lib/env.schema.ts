import z from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  DATABASE_URL: z
    .string('DATABASE_URL is required and must be a valid string')
    .min(1, 'DATABASE_URL is required and must be a valid string'),
});

export const env = envSchema.parse(process.env);
