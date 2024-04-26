'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { ActionError, authAction } from '@/lib/auth-action';
import { createClient } from '@/lib/supabase/clients/server';
import { PushSubscriptionSchema } from '@/lib/validation';

export const insertSubscription = authAction(
  PushSubscriptionSchema,
  async (subscription, { user }) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id: user.id,
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
  async (_subscription, { user }) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      throw new ActionError(
        error.message || 'Failed to delete push subscription'
      );
    }
  }
);

export const updateOnboarded = authAction(
  z.boolean(),
  async (data, { user }) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from('profiles')
      .update({ onboarded: data })
      .eq('id', user.id);

    if (error) {
      throw new ActionError(
        error.message || 'Failed to update user onboarded status'
      );
    }
  }
);
