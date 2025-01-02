import 'server-only';

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
// https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/connecting-to-postgres/serverless-drivers.mdx
// https://github.com/nextauthjs/next-auth/issues/10773
import { keys } from './keys';
import * as schema from './schema';

// if we're running locally
if (!process.env.VERCEL_ENV) {
  neonConfig.wsProxy = (host) => `${host}:54330/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

const connectionString = keys().DATABASE_URL;
const pool = new Pool({
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
