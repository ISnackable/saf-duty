'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';

import { client, useSession } from '@repo/auth/client';
import { PasswordInput } from '@repo/design-system/components/password-input';
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
} from '@repo/design-system/components/ui/alert-dialog';
import {
  Button,
  buttonVariants,
} from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';
import { updateFormSchema } from '../../../schemas/auth';

const accountFormSchema = updateFormSchema.refine(
  (data) => data.newPassword !== data.oldPassword,
  {
    message: "New password can't be the same as your old password.",
    path: ['newPassword'], // path of error
  }
);

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    values: {
      email: session?.user?.email || '',
      oldPassword: '',
      newPassword: '',
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  async function onSubmit(data: AccountFormValues) {
    if (!session) {
      return;
    }
    setIsLoading(true);

    if (data.email === session.user.email && !data.newPassword) {
      toast.info('No changes detected');
      setIsLoading(false);
      return;
    }

    if (data.email !== session.user.email) {
      const { error } = await client.changeEmail({
        newEmail: data.email,
      });

      if (error) {
        toast.error('Failed to update email');
      } else {
        toast.success('Sent a verification email to your new email address');
      }
    }

    if (data.newPassword) {
      const { error } = await client.changePassword({
        newPassword: data.newPassword,
        currentPassword: data.oldPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error('Failed to update password');
      } else {
        toast.success('Password updated');
      }
    }

    setIsLoading(false);
  }

  return (
    <AlertDialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className="after:text-red-500 after:content-['_*']"
                  aria-required
                >
                  Email
                </FormLabel>
                <FormControl>
                  <Input placeholder="Your email address" {...field} />
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
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className="after:text-red-500 after:content-['_*']"
                  aria-required
                >
                  Old password
                </FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Old password" {...field} />
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
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="New password" {...field} />
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

          <div className="flex justify-between">
            <Button type="submit" disabled={isLoading}>
              Update account
            </Button>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive">
                Delete account
              </Button>
            </AlertDialogTrigger>
          </div>
        </form>
      </Form>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
