import 'server-only';

import { database } from '@repo/database';
// import { redis } from '@repo/rate-limit';
import { host, site } from '@repo/site-config';
import { type BetterAuthOptions, betterAuth } from 'better-auth';
import { emailHarmony } from 'better-auth-harmony';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { admin, organization } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';

export const betterAuthConfig = {
  database: prismaAdapter(database, { provider: 'postgresql' }),
  // TODO: Bug with setting activeOrganizationId when using secondary storage
  // secondaryStorage: {
  //   get: async (key) => {
  //     const value = (await redis.get(key)) as string | null;
  //     return value ? JSON.parse(JSON.stringify(value)) : null;
  //   },
  //   set: async (key, value, ttl) => {
  //     if (ttl) {
  //       await redis.set(key, JSON.stringify(value), { ex: ttl });
  //     } else {
  //       await redis.set(key, JSON.stringify(value));
  //     }
  //   },
  //   delete: async (key) => {
  //     await redis.del(key);
  //     return null;
  //   },
  // },
  // rateLimit: {
  //   storage: 'secondary-storage',
  // },
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
});

async function getActiveOrganizationByUserId(userId: string) {
  const organization = await database.organization.findFirst({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  });

  // Part of the onboarding process is to join an organization so this should never happen
  if (!organization) {
    throw new APIError('BAD_REQUEST');
  }

  return organization.id;
}

async function getOrganizationBySlug(organizationSlug: string) {
  const organization = await database.organization.findFirst({
    where: {
      slug: organizationSlug,
    },
  });

  if (!organization) {
    throw new APIError('BAD_REQUEST');
  }

  return organization.id;
}

export { toNextJsHandler } from 'better-auth/next-js';
