import 'dotenv/config';
import { demo } from '@repo/site-config';
import { reset, seed } from 'drizzle-seed';
import { auth } from '../auth/server';
import { database } from './index.node';
import * as schema from './schema';

const TODAY = new Date();
const LASTDAY = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0);

async function main() {
  await reset(database, schema);

  const ctx = await auth.$context;
  const hash = await ctx.password.hash(demo.password);

  // Seed the database with demo data
  await seed(database, {
    organizations: schema.organizations,
    users: schema.users,
    accounts: schema.accounts,
    members: schema.members,
    profiles: schema.profiles,
  }).refine((funcs) => ({
    organizations: {
      count: 1,
      columns: {
        id: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}c`,
        }),
        name: funcs.default({
          defaultValue: '1234',
        }),
        slug: funcs.default({
          defaultValue: '1234',
        }),
        createdAt: funcs.timestamp(),
        logo: funcs.default({
          defaultValue: 'https://api.dicebear.com/9.x/icons/svg?seed=Luis',
        }),
      },
    },
    users: {
      count: 1,
      columns: {
        id: funcs.default({
          defaultValue: demo.id,
        }),
        name: funcs.default({
          defaultValue: 'demo',
        }),
        image: funcs.default({
          defaultValue: 'https://api.dicebear.com/9.x/adventurer/svg?seed=demo',
        }),
        email: funcs.default({
          defaultValue: demo.email,
        }),
        emailVerified: funcs.default({
          defaultValue: true,
        }),
        initialOrganizationId: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}c`,
        }),
        createdAt: funcs.timestamp(),
        updatedAt: funcs.timestamp(),
        role: funcs.default({
          defaultValue: 'admin',
        }),
      },
    },
    accounts: {
      count: 1,
      columns: {
        id: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}a`,
        }),
        userId: funcs.default({
          defaultValue: demo.id,
        }),
        accountId: funcs.default({
          defaultValue: demo.id,
        }),
        providerId: funcs.default({
          defaultValue: 'credential',
        }),
        createdAt: funcs.timestamp(),
        updatedAt: funcs.timestamp(),
        password: funcs.default({
          defaultValue: hash,
        }),
      },
    },
    members: {
      count: 1,
      columns: {
        id: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}b`,
        }),
        organizationId: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}c`,
        }),
        userId: funcs.default({
          defaultValue: demo.id,
        }),
        role: funcs.default({
          defaultValue: 'owner',
        }),
        createdAt: funcs.timestamp(),
      },
    },
    profiles: {
      count: 1,
      columns: {
        id: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}e`,
        }),
        userId: funcs.default({
          defaultValue: demo.id,
        }),
        organizationId: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}c`,
        }),
        maxBlockouts: funcs.default({
          defaultValue: 8,
        }),
        userSettings: funcs.default({
          defaultValue: {
            notify_on_duty_reminder: true,
            notify_on_swap_requests: true,
            notify_on_rosters_published: true,
          },
        }),
      },
    },
  }));

  // Seed the database with other 'users' in the organization
  await seed(database, {
    ...schema,
    invitations: {},
    organizations: {},
    passkeys: {},
    sessions: {},
    verifications: {},
  }).refine((funcs) => ({
    users: {
      columns: {
        initialOrganizationId: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}c`,
        }),
        role: funcs.default({
          defaultValue: 'user',
        }),
      },
    },
    profiles: {
      columns: {
        organizationId: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}c`,
        }),
        maxBlockouts: funcs.default({
          defaultValue: 8,
        }),
        userSettings: funcs.default({
          defaultValue: {
            notify_on_duty_reminder: true,
            notify_on_swap_requests: true,
            notify_on_rosters_published: true,
          },
        }),
      },
    },
    rosters: {
      // Gets the no. of days of the current month
      count: LASTDAY.getDate(),
      columns: {
        organizationId: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}c`,
        }),
        dutyDate: funcs.valuesFromArray({
          values: Array.from({ length: LASTDAY.getDate() }, (_, i) => {
            return new Date(
              TODAY.getFullYear(),
              TODAY.getMonth(),
              i + 1
            ).toISOString();
          }),
        }),
      },
    },
    members: {
      columns: {
        organizationId: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}c`,
        }),
        role: funcs.default({
          defaultValue: 'member',
        }),
      },
    },
    invitations: {
      columns: {
        organizationId: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}c`,
        }),
      },
    },
    notifications: {
      columns: {
        organizationId: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}c`,
        }),
      },
    },
    pushSubscriptions: {
      count: 1,
    },
    swapRequests: {
      columns: {
        organizationId: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}c`,
        }),
      },
    },
  }));
}

main().then(() => {
  process.exit(0);
});
