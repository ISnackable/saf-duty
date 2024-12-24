import 'server-only';

// https://gist.github.com/kincaidoneil/bc2516111f0ec8850cd6020b8191b27b
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import { env } from '@repo/env';
import { WebSocket } from 'ws';

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
const adapter = new PrismaNeon(pool);
export const database = new PrismaClient({
  adapter,
});

export * from '@prisma/client';
