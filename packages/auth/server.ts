import 'server-only';

import { database, eq } from '@repo/database';
import { organization as _organization, member } from '@repo/database/schema';
import { redis } from '@repo/rate-limit';
import { host, site } from '@repo/site-config';
import { type BetterAuthOptions, betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { admin, organization } from 'better-auth/plugins';

export const betterAuthConfig = {
  database: drizzleAdapter(database, { provider: 'pg' }),
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
    },
  },
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
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...betterAuthConfig,
  user: {
    additionalFields: {
      initialOrganizationId: {
        type: 'string',
        required: true,
        input: true,
        returned: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // @ts-expect-error - unit is not typed here
          if (!user.initialOrganizationId) {
            throw new APIError('BAD_REQUEST');
          }

          const organizationId = await getOrganizationBySlug(
            // @ts-expect-error - unit is not typed
            user.initialOrganizationId
          );

          return {
            data: {
              ...user,
              initialOrganizationId: organizationId,
            },
          };
        },
        after: async (user) => {
          // Add the user to the organization
          const auth = betterAuth(betterAuthConfig);

          await auth.api.addMember({
            body: {
              userId: user.id,
              // @ts-expect-error - unit is not typed
              organizationId: user.initialOrganizationId,
              role: 'member',
            },
          });
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const organizationId = await getActiveOrganizationByUserId(
            session.userId
          );

          return {
            data: {
              ...session,
              activeOrganizationId: organizationId,
            },
          };
        },
      },
    },
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
});

async function getActiveOrganizationByUserId(userId: string) {
  const organization = await database.query.member.findFirst({
    where: eq(member.userId, userId),
  });

  // Part of the onboarding process is to join an organization so this should never happen
  if (!organization) {
    throw new APIError('BAD_REQUEST');
  }

  return organization.organizationId;
}

async function getOrganizationBySlug(organizationSlug: string) {
  const organization = await database.query.organization.findFirst({
    where: eq(_organization.slug, organizationSlug),
  });

  if (!organization) {
    throw new APIError('BAD_REQUEST');
  }

  return organization.id;
}

export { toNextJsHandler } from 'better-auth/next-js';
export const { handler } = auth;
