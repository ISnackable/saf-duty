import 'dotenv/config';
import { demo } from '@repo/site-config';
import { reset, seed } from 'drizzle-seed';
import { auth } from '../auth/server';
import { database } from './index.node';
import * as schema from './schema';

async function main() {
  await reset(database, schema);

  const ctx = await auth.$context;
  const hash = await ctx.password.hash(demo.password);

  await seed(database, {
    organization: schema.organization,
    user: schema.user,
    account: schema.account,
    member: schema.member,
  }).refine((funcs) => ({
    organization: {
      count: 1,
      columns: {
        id: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}o`,
        }),
        name: funcs.default({
          defaultValue: '1234',
        }),
        slug: funcs.default({
          defaultValue: '1234',
        }),
        createdAt: funcs.timestamp(),
      },
    },
    user: {
      count: 1,
      columns: {
        id: funcs.default({
          defaultValue: demo.id,
        }),
        name: funcs.default({
          defaultValue: 'demo',
        }),
        email: funcs.default({
          defaultValue: demo.email,
        }),
        emailVerified: funcs.default({
          defaultValue: true,
        }),
        initialOrganizationId: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}o`,
        }),
        createdAt: funcs.timestamp(),
        updatedAt: funcs.timestamp(),
        role: funcs.default({
          defaultValue: 'admin',
        }),
      },
    },
    account: {
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
    member: {
      count: 1,
      columns: {
        id: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}m`,
        }),
        organizationId: funcs.default({
          defaultValue: `${demo.id.slice(0, -1)}o`,
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
  }));
}

main().then(() => {
  process.exit(0);
});
