'use server';

import { z } from 'zod';

import { ActionError, authActionClient } from '@/lib/auth-action';
import { createClient } from '@/lib/supabase/clients/server';
import { pushSubscriptionSchema } from '@/lib/validation';

export const insertSubscription = authActionClient
  .schema(pushSubscriptionSchema)
  .action(async ({ parsedInput: subscription, ctx: { user } }) => {
    const supabase = await createClient();

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
  });

export const deleteSubscription = authActionClient
  .schema(pushSubscriptionSchema)
  .action(async ({ parsedInput: _subscription, ctx: { user } }) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      throw new ActionError(
        error.message || 'Failed to delete push subscription'
      );
    }
  });

export const updateOnboarded = authActionClient
  .schema(z.boolean())
  .action(async ({ parsedInput: data, ctx: { user } }) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('profiles')
      .update({ onboarded: data })
      .eq('id', user.id);

    if (error) {
      throw new ActionError(
        error.message || 'Failed to update user onboarded status'
      );
    }
  });

export const uploadAvatar = authActionClient
  .schema(z.instanceof(FormData))
  .action(async ({ parsedInput: formData, ctx: { user } }) => {
    const supabase = await createClient();

    const avatar = z
      .custom<File>((v) => v instanceof File || v instanceof Blob, {
        message: 'Image is required',
      })
      .parse(formData.get('file'));

    if (!avatar) {
      throw new ActionError('Avatar file not found in form data');
    }

    const fileExt = avatar?.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatar);

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (error || updateError) {
      throw new ActionError('Failed to update avatar');
    }

    return { publicUrl };
  });
