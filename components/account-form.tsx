'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { signOut } from '@/app/(auth)/actions';
import { updateAccount } from '@/app/(auth)/actions';
import { PasswordInput } from '@/components/password-input';
import { usePushNotificationContext } from '@/components/push-notification-provider';
import { customNotifyEvent } from '@/components/session-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useProfiles } from '@/hooks/use-profiles';
import { updateFormSchema } from '@/lib/validation';

const accountFormSchema = updateFormSchema.refine(
  (data) => data.newPassword !== data.oldPassword,
  {
    message: "New password can't be the same as your old password.",
    path: ['newPassword'], // path of error
  }
);

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const { data: profile, mutate } = useProfiles();
  const { onClickUnsubscribeToPushNotification, pushNotificationSupported } =
    usePushNotificationContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    values: {
      email: profile?.email || '',
      oldPassword: '',
      newPassword: undefined,
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  async function onSubmit(data: AccountFormValues) {
    if (!profile) return;
    setIsLoading(true);

    if (data.email === profile.email && !data.newPassword) {
      toast.info('No changes detected');
      setIsLoading(false);
      return;
    }

    const { serverError, data: serverData } = await updateAccount(data);

    if (serverData) {
      toast.success('Account updated successfully');
      customNotifyEvent('USER_UPDATED', serverData.session);
      mutate({ ...profile, email: data.email });
    }

    if (serverError) {
      toast.error(serverError);
    }

    setIsLoading(false);
  }

  return (
    <AlertDialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className="after:text-red-500 after:content-['_*']"
                  aria-required
                >
                  Email
                </FormLabel>
                <FormControl>
                  <Input placeholder='Your email address' {...field} />
                </FormControl>
                <FormDescription>
                  This is the email address that you use to login.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='oldPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className="after:text-red-500 after:content-['_*']"
                  aria-required
                >
                  Old password
                </FormLabel>
                <FormControl>
                  <PasswordInput placeholder='Old password' {...field} />
                </FormControl>
                <FormDescription>
                  Required to make changes to your account.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='New password' {...field} />
                </FormControl>
                <FormDescription>
                  Your password must be at least 6 characters and include a
                  number, a lowercase letter, an uppercase letter, and a special
                  character.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-between'>
            <Button type='submit' disabled={isLoading}>
              Update account
            </Button>
            <AlertDialogTrigger asChild>
              <Button type='button' variant='destructive'>
                Sign out of all devices
              </Button>
            </AlertDialogTrigger>
          </div>
        </form>
      </Form>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out everywhere?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure? This will sign you out of all your sessions and all
            devices. You will need to sign in again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await onClickUnsubscribeToPushNotification().catch(console.error);
              await signOut({ scope: 'global' });
              customNotifyEvent('SIGNED_OUT', null);
              if (pushNotificationSupported && navigator?.setAppBadge) {
                navigator.setAppBadge(0);
              }
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
