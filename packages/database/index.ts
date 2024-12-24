// import 'server-only';

// https://github.com/nextauthjs/next-auth/issues/10773
import { Pool, neonConfig } from '@neondatabase/serverless';
import { env } from '@repo/env';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { WebSocket } from 'ws';
import * as schema from './schema';

// Example Supabase pooled connection string (must use Supavisor)
const connectionString = env.DATABASE_URL;

const url = new URL(connectionString);
if (url.hostname === 'localhost') {
  // Disable SSL for local connections
  neonConfig.useSecureWebSocket = false;
  // WebSocket proxy is hosted on `4000` locally, so add port. Does not work in production.
  neonConfig.wsProxy = (host, port) => `${host}:${port}/v2`;
}

// Only Neon hosts support this -- non-deterministic errors otherwise
neonConfig.pipelineConnect = false;

// So it can also work in Node.js
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({
  connectionString,
});
export const database = drizzle({ client: pool, schema });

export * from 'drizzle-orm';
