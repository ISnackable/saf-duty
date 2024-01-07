import {
  DEFAULT_SERVER_ERROR,
  createSafeActionClient,
} from 'next-safe-action/zod';
import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';

export class MyCustomError extends Error {}

function handleReturnedServerError(e: Error) {
  // In this case, we can use the 'MyCustomError` class to unmask errors
  // and return them with their actual messages to the client.
  if (e instanceof MyCustomError) {
    return e.message;
  }

  // Every other error that occurs will be masked with the default message.
  return DEFAULT_SERVER_ERROR;
}

function handleServerErrorLog(e: Error) {
  console.error('Action error:', e.message);
}

// This is our base client.
export const action = createSafeActionClient({
  handleReturnedServerError,
  handleServerErrorLog,
});

// This client ensures that the user is authenticated before running action server code.
export const authAction = createSafeActionClient({
  // Can also be a non async function.
  async middleware() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new MyCustomError('Session not found!');
    }

    // TODO: remove this and use anonymous auth instead
    if (session.user.email === 'demo@example.com') {
      throw new MyCustomError(
        'Unauthorized, demo user cannot perform this action!'
      );
    }

    return { userId: session.user.id };
  },
  handleReturnedServerError,
  handleServerErrorLog,
});
