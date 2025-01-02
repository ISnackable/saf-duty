import 'server-only';
import { auth } from '@repo/auth/server';
import { headers } from 'next/headers';
import { Svix } from 'svix';
import { keys } from '../keys';

const svixToken = keys().SVIX_TOKEN;

export const send = async (eventType: string, payload: object) => {
  if (!svixToken) {
    throw new Error('SVIX_TOKEN is not set');
  }

  const svix = new Svix(svixToken);
  const member = await auth.api.getActiveMember({
    headers: await headers(),
  });

  if (!member?.organizationId) {
    return;
  }

  return svix.message.create(member.organizationId, {
    eventType,
    payload: {
      eventType,
      ...payload,
    },
    application: {
      name: member.organizationId,
      uid: member.organizationId,
    },
  });
};

export const getAppPortal = async () => {
  if (!svixToken) {
    throw new Error('SVIX_TOKEN is not set');
  }

  const svix = new Svix(svixToken);
  const member = await auth.api.getActiveMember({
    headers: await headers(),
  });

  if (!member?.organizationId) {
    return;
  }

  return svix.authentication.appPortalAccess(member.organizationId, {
    application: {
      name: member.organizationId,
      uid: member.organizationId,
    },
  });
};
