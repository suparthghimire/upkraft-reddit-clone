import z from 'zod';
import 'dotenv/config';

export enum E_NODE_ENV_ENUM {
  local = 'local',
  development = 'development',
  staging = 'staging',
  production = 'production',
}

const envSchema = z.object({
  NODE_ENV: z.enum(E_NODE_ENV_ENUM, {
    error() {
      return {
        message: `Invalid enum. Use one of ${Object.values(E_NODE_ENV_ENUM).join(', ')}`,
      };
    },
  }),
  WHITE_LISTED_FE_ORIGINS: z
    .string()
    .min(1, 'Please add valid white listed FE origins')
    .transform((v) => v.split(',')),
  DATABASE_URL: z
    .string('DATABASE_URL is required and must be a valid string')
    .min(1, 'DATABASE_URL is required and must be a valid string'),
  ACCESS_TOKEN_SECRET: z
    .string('ACCESS_TOKEN_SECRET is required and must be a valid string')
    .min(1, 'ACCESS_TOKEN_SECRET is required and must be a valid string'),

  QDRANT_API_KEY: z.string().min(1, 'QDRANT_API_KEY is required and must be a valid string'),
  QDRANT_ENDPOINT: z.string().min(1, 'QDRANT_ENDPOINT is required and must be a valid string'),

  OPENAI_API_KEY: z.string(),

  // S3
  AWS_ACCESS_KEY_ID: z.string().min(1, 'AWS_ACCESS_KEY_ID is required and must be a valid string'),
  AWS_SECRET_ACCESS_KEY: z
    .string()
    .min(1, 'AWS_SECRET_ACCESS_KEY is required and must be a valid string'),
  AWS_SESSION_TOKEN: z.string().min(1, 'AWS_SESSION_TOKEN is required and must be a valid string'),
  AWS_REGION: z.string().min(1, 'AWS_REGION is required and must be a valid string'),
  AWS_S3_BUCKET_NAME: z
    .string()
    .min(1, 'AWS_S3_BUCKET_NAME is required and must be a valid string'),
});

export const env = envSchema.parse(process.env);
