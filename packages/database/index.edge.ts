import 'server-only';

// https://github.com/nextauthjs/next-auth/issues/10773
import { Pool, neonConfig } from '@neondatabase/serverless';
import { env } from '@repo/env';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

// Example Supabase pooled connection string (must use Supavisor)
const connectionString = env.DATABASE_URL;
// Only Neon hosts support this -- non-deterministic errors otherwise
neonConfig.pipelineConnect = false;

const pool = new Pool({
  connectionString,
});
export const database = drizzle({ client: pool, schema });

export * from 'drizzle-orm';
