import { database } from '@repo/database';
import { betterAuth } from 'better-auth';
import { emailHarmony } from 'better-auth-harmony';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { multiSession, organization, passkey } from 'better-auth/plugins';

export const auth = betterAuth({
  database: prismaAdapter(database, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
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
});
