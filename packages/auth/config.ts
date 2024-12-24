import { host, site } from '@repo/site-config';
import type { BetterAuthOptions } from 'better-auth';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { admin, organization } from 'better-auth/plugins';

export const betterAuthConfig = {
  rateLimit: {
    // Because we are using Free tier, so we try to keep the rate limit low 😢
    storage: 'memory',
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
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
  ],
  advanced: {
    cookiePrefix: site.shortName.toLowerCase(),
  },
  trustedOrigins: [host],
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
} satisfies BetterAuthOptions;

export { toNextJsHandler } from 'better-auth/next-js';
export const { handler } = betterAuth(betterAuthConfig);
