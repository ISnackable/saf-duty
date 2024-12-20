import { database } from '@repo/database';
import { redis } from '@repo/rate-limit';
import { site } from '@repo/site-config';
import { betterAuth } from 'better-auth';
import { emailHarmony } from 'better-auth-harmony';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { multiSession, organization, passkey } from 'better-auth/plugins';

export const auth = betterAuth({
  database: prismaAdapter(database, { provider: 'postgresql' }),
  secondaryStorage: {
    get: async (key) => {
      const value = (await redis.get(key)) as string | null;
      return value ? JSON.parse(JSON.stringify(value)) : null;
    },
    set: async (key, value, ttl) => {
      if (ttl) {
        await redis.set(key, JSON.stringify(value), { ex: ttl });
      } else {
        await redis.set(key, JSON.stringify(value));
      }
    },
    delete: async (key) => {
      await redis.del(key);
      return null;
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignUp: true,
  },
  rateLimit: {
    storage: 'secondary-storage',
  },
  plugins: [
    nextCookies(),
    organization(),
    passkey(),
    multiSession({
      maximumSessions: 3,
    }),
    emailHarmony(),
  ],
  advanced: {
    cookiePrefix: site.shortName,
  },
});

export { toNextJsHandler } from 'better-auth/next-js';
