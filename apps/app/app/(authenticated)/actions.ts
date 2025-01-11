'use server';

import { z } from 'zod';

import { ActionError, authActionClient } from '@/lib/auth/actions';
import { database, eq } from '@repo/database';
import { pushSubscriptions } from '@repo/database/schema';

const pushSubscriptionSchema = z.object({
  endpoint: z.string(),
  expirationTime: z.number().optional().nullable(),
  keys: z.object({
    auth: z.string(),
    p256dh: z.string(),
  }),
});

export const insertSubscription = authActionClient
  .schema(pushSubscriptionSchema)
  .action(async ({ parsedInput: subscription, ctx: { session } }) => {
    try {
      await database.insert(pushSubscriptions).values({
        userId: session.user.id,
        pushSubscriptionDetails: subscription,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new ActionError(error.message);
      }
      throw new ActionError('Failed to add push subscription');
    }
  });

export const deleteSubscription = authActionClient
  .schema(pushSubscriptionSchema)
  .action(async ({ parsedInput: _subscription, ctx: { session } }) => {
    try {
      await database
        .delete(pushSubscriptions)
        .where(eq(pushSubscriptions.userId, session.user.id));
    } catch (error) {
      if (error instanceof Error) {
        throw new ActionError(error.message);
      }
      throw new ActionError('Failed to delete push subscription');
    }
  });
