import { env } from '@repo/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: '../../packages/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
