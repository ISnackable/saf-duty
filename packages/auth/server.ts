import 'server-only';

import { database, eq } from '@repo/database';
import { organizations, users } from '@repo/database/schema';
import { redis } from '@repo/rate-limit';
import { site, trustedOrigins } from '@repo/site-config';
import { type BetterAuthOptions, betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { admin, organization } from 'better-auth/plugins';

export const betterAuthConfig = {
  database: drizzleAdapter(database, { provider: 'pg', usePlural: true }),
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
    admin(),
    organization({
      async sendInvitationEmail(data) {
        const inviteLink = `https://example.com/accept-invitation/${data.id}`;

        // TODO: send email
      },
    }),
    nextCookies(),
  ],
  advanced: {
    generateId: false,
    useSecureCookies: !!process.env.VERCEL_ENV,
    cookiePrefix: site.shortName.toLowerCase(),
  },
  trustedOrigins,
  user: {
    additionalFields: {
      initialOrganizationId: {
        type: 'string',
        required: true,
        input: true,
        returned: true,
      },
      onboarded: {
        type: 'boolean',
        required: true,
        defaultValue: 'false',
        input: false,
        returned: true,
      },
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...betterAuthConfig,
  user: {
    ...betterAuthConfig.user,
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async (
        { user, newEmail, url, token },
        request
      ) => {
        console.dir({
          to: newEmail,
          subject: 'Verify your email change',
          text: `Click the link to verify: ${url}`,
        });
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      // TODO: send email
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log('sendVerificationEmail', user, url, token);
      // TODO: send email
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
          const seed = Math.random();

          return {
            data: {
              ...user,
              role: 'user',
              image: `https://api.dicebear.com/9.x/adventurer/svg?backgroundColor=c0aede&seed=${seed}`,
              initialOrganizationId: organizationId,
            },
          };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const user = await getUserById(session.userId);

          if (!user.onboarded) {
            try {
              const context = await auth.$context;
              const task1 = auth.api.addMember({
                body: {
                  userId: user.id,
                  organizationId: user.initialOrganizationId,
                  role: 'member',
                },
              });

              // Update user onboarded status
              const task2 = context.internalAdapter.updateUser(user.id, {
                onboarded: true,
              });

              await Promise.all([task1, task2]);
            } catch (_error) {
              throw new APIError('INTERNAL_SERVER_ERROR', {
                message: 'Failed to add user to organization',
              });
            }
          }

          return {
            data: {
              ...session,
              activeOrganizationId: user.initialOrganizationId,
            },
          };
        },
      },
    },
  },
});

async function getUserById(userId: string) {
  const user = await database.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new APIError('BAD_REQUEST');
  }

  return user;
}

async function getOrganizationBySlug(organizationSlug: string) {
  const organization = await database.query.organizations.findFirst({
    where: eq(organizations.slug, organizationSlug),
  });

  if (!organization) {
    throw new APIError('BAD_REQUEST');
  }

  return organization.id;
}

export { toNextJsHandler } from 'better-auth/next-js';
