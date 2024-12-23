import { auth } from '@repo/auth/server';
import { demo } from '@repo/site-config';
import { database } from '../index';

async function main() {
  const ctx = await auth.$context;
  const hash = await ctx.password.hash(demo.password);

  const organization = await database.organization.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      id: ctx.generateId({ model: 'organization' }),
      name: 'demo',
      slug: 'demo',
      createdAt: new Date(),
    },
  });

  const user = await database.user.upsert({
    where: { email: demo.email },
    update: {},
    create: {
      id: demo.id,
      name: 'demo',
      email: demo.email,
      emailVerified: true,
      initialOrganizationId: organization.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'admin',
    },
  });

  const _account = await database.account.upsert({
    where: { id: `${demo.id.slice(0, -1)}a` },
    update: {},
    create: {
      id: `${demo.id.slice(0, -1)}a`,
      userId: user.id,
      accountId: user.id,
      providerId: 'credential',
      createdAt: new Date(),
      updatedAt: new Date(),
      password: hash,
    },
  });

  const _member = await database.member.upsert({
    where: { id: `${demo.id.slice(0, -1)}m` },
    update: {},
    create: {
      id: `${demo.id.slice(0, -1)}m`,
      organizationId: organization.id,
      userId: user.id,
      role: 'owner',
      createdAt: new Date(),
    },
  });
}

main()
  .catch((e) => {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(e);
  })
  .finally(async () => {
    await database.$disconnect();
  });
