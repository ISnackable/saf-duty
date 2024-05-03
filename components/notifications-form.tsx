'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { LoadingButton } from '@/components//loading-button';
import { InstallPWA } from '@/components/install-pwa';
import { usePushNotificationContext } from '@/components/push-notification-provider';
import { useUser } from '@/components/session-provider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useOs } from '@/hooks/use-os';
import { useProfiles } from '@/hooks/use-profiles';
import { fetcher } from '@/lib/fetcher';
import { isDemoUser } from '@/utils/helper';

const notificationsFormSchema = z.object({
  notify_on_rosters_published: z.boolean().default(true),
  notify_on_swap_requests: z.boolean().default(true),
  notify_on_duty_reminder: z.boolean().default(true),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export function NotificationsForm() {
  const user = useUser();
  const { data: profile, mutate } = useProfiles();

  const {
    userSubscription,
    userConsent,
    isPWAInstalled,
    pushNotificationSupported,
    onClickAskUserPermission,
    onClickSubscribeToPushNotification,
    onClickUnsubscribeToPushNotification,
  } = usePushNotificationContext();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState<CheckedState>(false);
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    values: {
      notify_on_duty_reminder:
        profile?.user_settings?.notify_on_duty_reminder ?? true,
      notify_on_rosters_published:
        profile?.user_settings?.notify_on_rosters_published ?? true,
      notify_on_swap_requests:
        profile?.user_settings?.notify_on_swap_requests ?? true,
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });
  const os = useOs();

  useEffect(() => {
    if (pushNotificationSupported && userSubscription) {
      setChecked(true);
    }
  }, [pushNotificationSupported, userSubscription]);

  function onSubmit(data: NotificationsFormValues) {
    if (!user) return;

    startTransition(() => {
      const resPromise = fetcher(`/api/profiles/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          user_settings: data,
        }),
      }).then(() => {
        if (profile)
          mutate({
            ...profile,
            user_settings: data,
          });
      });

      toast.promise(resPromise, {
        loading: 'Loading...',
        success: 'Notification settings updated.',
        error: 'An error occurred.',
        description(data) {
          if (data instanceof Error) return data.message;
          return `You can now close this page.`;
        },
      });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='items-top flex space-x-2'>
          <InstallPWA open={open} onOpenChange={setOpen}>
            <Checkbox
              disabled={isLoading}
              checked={checked}
              onCheckedChange={async (checkedState) => {
                if (os === 'ios' || os === 'android' || os === 'undetermined') {
                  if (!isPWAInstalled || !pushNotificationSupported) {
                    setOpen((prev) => !prev);
                    return;
                  }
                }

                if (!user) return;

                if (isDemoUser(user.id)) {
                  toast.warning('Demo users cannot enable notifications');
                  return;
                }

                setIsLoading(true);

                if (userConsent === 'default') {
                  await onClickAskUserPermission();
                  toast.warning('Please click again to enable notifications');
                  setIsLoading(false);
                  return;
                }

                setChecked(checkedState);

                if (checkedState) {
                  if (userConsent === 'granted') {
                    const subscription =
                      await onClickSubscribeToPushNotification();

                    if (!subscription) {
                      toast.error('You have blocked notifications', {
                        description:
                          'Please enable notifications in your browser/OS settings app.',
                      });
                      setIsLoading(false);
                      return;
                    }

                    toast.success(`Subscribed to push notifications`);
                  } else {
                    setChecked(false);
                    toast.error('You have blocked notifications', {
                      description:
                        'Please enable notifications in your browser/OS settings app.',
                    });
                  }
                } else {
                  await onClickUnsubscribeToPushNotification();
                  toast.success(`Unsubscribed from push notifications`);
                }

                setIsLoading(false);
              }}
            />
          </InstallPWA>

          <div className='grid gap-1.5 leading-none'>
            <label
              htmlFor='notifications-checkbox'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Enable push notifications for this device
            </label>
            <p className='text-sm text-muted-foreground'>
              The first time you enable push notifications, you will have to
              grant permission to receive notifications.
            </p>
          </div>
        </div>

        <div>
          <h3 className='mb-4 text-lg font-medium'>Notifications Options</h3>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='notify_on_rosters_published'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      On duty roster published
                    </FormLabel>
                    <FormDescription>
                      Receive a notification whenever a new duty roster is
                      published.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={!userSubscription ? true : false}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='notify_on_swap_requests'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Duty swap requests and approvals
                    </FormLabel>
                    <FormDescription>
                      Receive a notification when someone requests to swap a
                      duty with you.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={!userSubscription ? true : false}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='notify_on_duty_reminder'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Reminder of your duties
                    </FormLabel>
                    <FormDescription>
                      Receive a reminder notification for your duties on the
                      previous day.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={!userSubscription ? true : false}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <LoadingButton
          type='submit'
          loading={isPending}
          disabled={!(pushNotificationSupported && userSubscription)}
        >
          Update notifications
        </LoadingButton>
      </form>
    </Form>
  );
}
