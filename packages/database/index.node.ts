import 'server-only';

// https://github.com/nextauthjs/next-auth/issues/10773
import { env } from '@repo/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Example Supabase pooled connection string (must use Supavisor)
const connectionString = env.DATABASE_URL;
// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const database = drizzle({ client, schema });

export * from 'drizzle-orm';
