import 'server-only';

// https://github.com/nextauthjs/next-auth/issues/10773
import { env } from '@repo/env';
import { createPool } from '@vercel/postgres';

import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

// Example Supabase pooled connection string (must use Supavisor)
const connectionString = env.DATABASE_URL;
const pool = createPool({
  connectionString,
});
export const database = drizzle(pool, { schema });

export * from 'drizzle-orm';
