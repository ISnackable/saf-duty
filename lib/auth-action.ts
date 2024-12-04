import 'server-only';

import { createSafeActionClient } from 'next-safe-action';

import { createClient } from '@/lib/supabase/clients/server';
import { isDemoUser } from '@/utils/helper';

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  // Can also be an async function.
  handleServerError(e, _utils) {
    // You can access these properties inside the `utils` object.
    // const { clientInput, bindArgsClientInputs, metadata, ctx } = utils;

    // Log to console.
    console.error('Action error:', e.message);

    // Return generic message
    return e.message || 'Oh no, something went wrong!';
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new ActionError('Session not found!');
  }

  if (isDemoUser(user.id)) {
    throw new ActionError(
      'Unauthorized, demo user cannot perform this action!'
    );
  }

  return next({ ctx: { user } });
});
