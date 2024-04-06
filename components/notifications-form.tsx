'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type CheckedState } from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { InstallPWA } from '@/components/install-pwa';
import { usePushNotificationContext } from '@/components/push-notification-provider';
import { useSession } from '@/components/session-provider';
import { Button } from '@/components/ui/button';
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
import { isDemoUser } from '@/utils/helper';

const notificationsFormSchema = z.object({
  duty_roster_published: z.boolean().default(true),
  swap_request_updates: z.boolean().default(true),
  duty_reminder: z.boolean().default(true),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<NotificationsFormValues> = {
  duty_roster_published: true,
  swap_request_updates: true,
  duty_reminder: true,
};

export function NotificationsForm() {
  const session = useSession();

  const {
    userSubscription,
    userConsent,
    isPWAInstalled,
    pushNotificationSupported,
    onClickAskUserPermission,
    onClickSubscribeToPushNotification,
    onClickUnsubscribeToPushNotification,
  } = usePushNotificationContext();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<CheckedState>(false);
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  });
  const os = useOs();

  useEffect(() => {
    if (pushNotificationSupported && userSubscription) {
      setChecked(true);
    }
  }, [pushNotificationSupported, userSubscription]);

  function onSubmit(data: NotificationsFormValues) {
    toast('You submitted the following values:', {
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='items-top flex space-x-2'>
          <InstallPWA open={open} onOpenChange={setOpen}>
            <Checkbox
              id='terms1'
              checked={checked}
              onCheckedChange={async (checkedState) => {
                if (os === 'ios' || os === 'android' || os === 'undetermined') {
                  if (!isPWAInstalled || !pushNotificationSupported) {
                    setOpen((prev) => !prev);
                    return;
                  }
                }

                if (!session) return;

                if (isDemoUser(session.user.id)) {
                  toast.warning('Demo users cannot enable notifications');
                  return;
                }

                if (userConsent === 'default') {
                  await onClickAskUserPermission();
                  toast.warning('Please click again to enable notifications');
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
              }}
            />
          </InstallPWA>

          <div className='grid gap-1.5 leading-none'>
            <label
              htmlFor='terms1'
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
              name='duty_roster_published'
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
              name='swap_request_updates'
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
              name='duty_reminder'
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

        <Button type='submit'>Update notifications</Button>
      </form>
    </Form>
  );
}
