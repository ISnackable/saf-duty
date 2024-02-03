import 'server-only';

import { DEFAULT_SERVER_ERROR, createSafeActionClient } from 'next-safe-action';
import { cookies } from 'next/headers';

import { isDemoUser } from '@/utils/demo';
import { createClient } from '@/utils/supabase/actions';

export class ActionError extends Error {}

function handleReturnedServerError(e: Error) {
  // In this case, we can use the 'MyCustomError` class to unmask errors
  // and return them with their actual messages to the client.
  if (e instanceof ActionError) {
    throw e.message;
  }

  // Every other error that occurs will be masked with the default message.
  return DEFAULT_SERVER_ERROR;
}

function handleServerErrorLog(e: Error) {
  console.error('Action error:', e.message);
}

// This client ensures that the user is authenticated before running action server code.
export const authAction = createSafeActionClient({
  // Can also be a non async function.
  async middleware() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new ActionError('Session not found!');
    }

    if (isDemoUser(user?.id)) {
      throw new ActionError(
        'Unauthorized, demo user cannot perform this action!'
      );
    }

    return { userId: user.id };
  },
  handleReturnedServerError,
  handleServerErrorLog,
});
