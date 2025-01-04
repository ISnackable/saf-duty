import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
// https://github.com/nextauthjs/next-auth/issues/10773
import { keys } from './keys';
import * as relations from './relations';
import * as schema from './schema';

// Example Supabase pooled connection string (must use Supavisor)
const connectionString = keys().DATABASE_URL;
// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const database = drizzle({
  client,
  schema: {
    ...schema,
    ...relations,
  },
});

export * from 'drizzle-orm';
