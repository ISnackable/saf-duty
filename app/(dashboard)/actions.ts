'use server';

import { formatISO } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { RedirectType, redirect } from 'next/navigation';
import { z } from 'zod';

import { ActionError, authAction } from '@/lib/safe-action';
import { PushSubscriptionSchema } from '@/utils/push-validation';
import { createClient } from '@/utils/supabase/server';

// TODO: Suppose to also validate the max length of blockout_dates for each month :)
export const insertBlockoutDates = authAction(
  z.array(
    z.coerce
      .date()
      .transform((date) => formatISO(date, { representation: 'date' }))
  ),
  async (blockoutDates, { userId }) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from('profiles')
      .update({ blockout_dates: blockoutDates })
      .eq('id', userId);

    if (error) {
      throw new ActionError(error.message || 'Failed to update blockout dates');
    }

    revalidatePath('/(dashboard)/manage-blockouts', 'page');
  }
);

export const insertSubscription = authAction(
  PushSubscriptionSchema,
  async (subscription, { userId }) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id: userId,
        push_subscription_details: subscription,
      },
      {
        onConflict: 'user_id',
      }
    );

    if (error) {
      throw new ActionError(error.message || 'Failed to add push subscription');
    }
  }
);

export const deleteSubscription = authAction(
  PushSubscriptionSchema,
  async (_subscription, { userId }) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new ActionError(
        error.message || 'Failed to delete push subscription'
      );
    }
  }
);
