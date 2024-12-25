import { resolve } from 'node:path';
import { env } from '@repo/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: resolve(__dirname, '../../packages/database/schema.ts'),
  out: resolve(__dirname, '../../packages/database/drizzle'),
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
