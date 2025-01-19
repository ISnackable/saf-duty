import 'dotenv/config';
import { demo } from '@repo/site-config';
import { reset, seed } from 'drizzle-seed';
import { auth } from '../auth/server';
import { database } from './index.node';
import * as schema from './schema';

const TODAY = new Date();
const LASTDAY = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0);
const USER_UUIDS = [
  demo.id,
  '21fa547f-a051-4af7-a71d-67bebace76ad',
  'f8458b80-8d4a-4e86-9e8f-4cdb219ca7b0',
  '878b146a-7bcf-446d-8f47-71f07de0502a',
  '8c2750ed-c1c7-41ff-b8ac-47b669ed6e80',
  '3af4f1e3-2f7e-4ef7-8cb4-6d9344e2bbe8',
  '2e43fa6c-9bd4-4a6e-95cc-614f1afbe157',
  '411ebf89-0b91-4758-b555-a915720f8ce2',
  '1eb1b505-5f54-41e5-ba1d-6a9ebf0c8b90',
  'a9722408-a0f3-46c6-b5a0-d8c237dadff5',
];
const USER_EMAILS = [
  demo.email,
  'elizabeth.martin34@example.com',
  'jacob.smith92@example.com',
  'samantha.jameson87@example.com',
  'robert.brown59@example.com',
  'olivia.wilson75@example.com',
  'michael.davis66@example.com',
  'emily.lee29@example.com',
  'alexander.clark31@example.com',
  'grace.taylor46@example.com',
];
const USER_IMAGES = USER_UUIDS.map((uuid) => {
  return `https://api.dicebear.com/9.x/adventurer/svg?backgroundColor=c0aede&seed=${uuid}`;
});

async function main() {
  await reset(database, schema);

  const ctx = await auth.$context;
  const hash = await ctx.password.hash(demo.password);

  // Seed the database with demo data
  await seed(database, {
    ...schema,
    pushSubscriptions: {},
    verifications: {},
    passkeys: {},
    sessions: {},
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
      count: USER_UUIDS.length,
      columns: {
        id: funcs.valuesFromArray({
          values: USER_UUIDS,
          isUnique: true,
        }),
        image: funcs.valuesFromArray({
          values: USER_IMAGES,
          isUnique: true,
        }),
        email: funcs.valuesFromArray({
          values: USER_EMAILS,
          isUnique: true,
        }),
        emailVerified: funcs.default({
          defaultValue: true,
        }),
        initialOrganizationId: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}c`,
        }),
        banned: funcs.default({
          defaultValue: false,
        }),
        role: funcs.default({
          defaultValue: 'user',
        }),
        onboarded: funcs.default({
          defaultValue: true,
        }),
      },
      with: {
        accounts: 1,
        members: 1,
        profiles: 1,
      },
    },
    accounts: {
      columns: {
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
      columns: {
        organizationId: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}c`,
        }),
        role: funcs.default({
          defaultValue: 'member',
        }),
        createdAt: funcs.timestamp(),
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
      with: {
        swapRequests: 1,
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
