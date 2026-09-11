import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from './lib/env.schema.js';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schemas/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
