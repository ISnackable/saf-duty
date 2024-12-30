import 'server-only';

// https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/connecting-to-postgres/serverless-drivers.mdx
// https://github.com/nextauthjs/next-auth/issues/10773
import { neonConfig } from '@neondatabase/serverless';
import { env } from '@repo/env';
import { createPool } from '@vercel/postgres';

import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

// Example Supabase pooled connection string, add the following sufix "?workaround=supabase-pooler.vercel" (important)
const connectionString = env.DATABASE_URL;

// if we're running locally
if (!process.env.VERCEL_ENV || !connectionString.includes('workaround=')) {
  neonConfig.wsProxy = (host) => `${host}:54330/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

const pool = createPool({
  connectionString,
  // https://github.com/vercel/storage/blob/3333217438a7b601a4a96e11c8df7c75b77f49b6/packages/postgres/src/create-pool.ts#L106
  // This is probably the reason why Vercel Functions hangs,
  // hence we set it to 1 (which is already the default value using @vercel/postgres)
  // I believe @neondatabase/serverless uses the default value of 10 - node-postgres
  maxUses: 1,
  // Same reason as above, read the GitHub link above for more details
  // An arbitrary large number to prevent running out of connections
  max: 10_000,
});
export const database = drizzle(pool, { schema });

export * from 'drizzle-orm';
