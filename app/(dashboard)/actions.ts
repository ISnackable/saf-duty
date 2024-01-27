'use server';

import { cookies } from 'next/headers';

import { MyCustomError, authAction } from '@/lib/safe-action';
import { PushSubscriptionSchema } from '@/utils/push-validation';
import { createClient } from '@/utils/supabase/server';

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
      throw new MyCustomError(
        error.message || 'Failed to add push subscription'
      );
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
      throw new MyCustomError(
        error.message || 'Failed to delete push subscription'
      );
    }
  }
);
