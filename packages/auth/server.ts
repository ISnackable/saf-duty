import 'server-only';

import { database, eq } from '@repo/database';
import { members, organizations } from '@repo/database/schema';
import { redis } from '@repo/rate-limit';
import { host, site } from '@repo/site-config';
import { type BetterAuthOptions, betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { admin, organization } from 'better-auth/plugins';
import { type JWTPayload, type JWTVerifyResult, jwtVerify } from 'jose';

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
    generateId: false,
    cookiePrefix: site.shortName.toLowerCase(),
  },
  trustedOrigins: [host],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...betterAuthConfig,
  user: {
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

          return {
            data: {
              ...user,
              role: 'user',
              image: `https://api.dicebear.com/9.x/adventurer/svg?seed=${user.name}`,
              initialOrganizationId: organizationId,
            },
          };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          // Maybe we use redis to store the active organization
          const organizationId = await getOrganizationByUserId(session.userId);

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
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/verify-email' && ctx?.query?.token) {
        let jwt: JWTVerifyResult<JWTPayload>;
        try {
          jwt = await jwtVerify(
            ctx.query.token,
            new TextEncoder().encode(ctx.context.secret),
            { algorithms: ['HS256'] }
          );
        } catch (_error) {
          // If the token is invalid, immediately return
          return;
        }

        const parsed = jwt.payload;
        // updatedTo is the new email, which means the user is updating the email
        if (parsed.updateTo || !parsed.email) {
          // Since we only want to do something when the user is verifying the email for the first time
          // We can quickly return here
          return;
        }

        const user = await ctx.context.internalAdapter.findUserByEmail(
          // Since this hook is called after email is verified, we can safely assume that the email is valid
          parsed.email as string
        );

        if (!user) {
          // If the user is not found, then we should throw an error
          return;
        }

        // @ts-expect-error - additonal fields are not typed
        if (!user.user.onboarded) {
          // If the user is not already a member of the organization, then add the user
          const auth = betterAuth(betterAuthConfig);

          await auth.api.addMember({
            body: {
              userId: user.user.id,
              // @ts-expect-error - additonal fields are not typed
              organizationId: user.user.initialOrganizationId,
              role: 'member',
            },
          });

          await ctx.context.internalAdapter.updateUser(user.user.id, {
            onboarded: true,
          });
        }
      }
    }),
  },
});

async function getOrganizationByUserId(userId: string) {
  const organization = await database.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  // Part of the onboarding process is to join an organization so this should never happen
  if (!organization) {
    throw new APIError('BAD_REQUEST');
  }

  return organization.organizationId;
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
