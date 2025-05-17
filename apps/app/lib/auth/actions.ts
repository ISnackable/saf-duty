import 'server-only';

import { createSafeActionClient } from 'next-safe-action';

import { isDemoUser } from '@repo/auth/lib/utils';
import { auth } from '@repo/auth/server';
import { log } from '@repo/observability/log';
import { headers } from 'next/headers';

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  // Can also be an async function.
  handleServerError(e, _utils) {
    // You can access these properties inside the `utils` object.
    // const { clientInput, bindArgsClientInputs, metadata, ctx } = utils;

    // Log to console.
    log.error(`Action error: ${e.message}`);

    // Return generic message
    return e.message || 'Oh no, something went wrong!';
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new ActionError('Session not found!');
  }

  if (isDemoUser(session.user.id)) {
    throw new ActionError(
      'Unauthorized, demo user cannot perform this action!'
    );
  }

  return next({ ctx: { session } });
});
