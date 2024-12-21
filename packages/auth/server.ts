import 'server-only';

import { database } from '@repo/database';
import { redis } from '@repo/rate-limit';
import { site } from '@repo/site-config';
import { betterAuth } from 'better-auth';
import { emailHarmony } from 'better-auth-harmony';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { admin, organization } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';

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
  rateLimit: {
    storage: 'secondary-storage',
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      // TODO: send email
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // TODO: send email
    },
  },
  plugins: [
    nextCookies(),
    admin(),
    organization({
      async sendInvitationEmail(data) {
        const inviteLink = `https://example.com/accept-invitation/${data.id}`;

        // TODO: send email
      },
    }),
    passkey(),
    emailHarmony(),
  ],
  advanced: {
    cookiePrefix: site.shortName.toLowerCase(),
  },
});

export { toNextJsHandler } from 'better-auth/next-js';
