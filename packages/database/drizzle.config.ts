import { resolve } from 'node:path';
import { env } from '@repo/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: resolve(__dirname, './schema.ts'),
  out: resolve(__dirname, './drizzle'),
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
