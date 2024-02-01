'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type Session } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { signOut } from '@/app/(auth)/actions';
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
import { requirements } from '@/utils/auth-validation';

import { PasswordInput } from './password-input';

const accountFormSchema = z
  .object({
    email: z
      .string({
        required_error: 'Please select an email to display.',
      })
      .email(),
    old_password: z
      .string()
      .min(6, {
        message: 'Password must be at least 6 characters',
      })
      .max(32, { message: 'Password must be less than 32 characters' }),
    new_password: z
      .string()
      .min(6, {
        message: 'Password must be at least 6 characters',
      })
      .max(32, { message: 'Password must be less than 32 characters' })
      .refine(
        (value) => {
          return requirements.every((requirement) =>
            requirement.re.test(value)
          );
        },
        {
          message:
            'Password must include a number, a lowercase letter, an uppercase letter, and a special character',
        }
      ),
  })
  .refine((data) => data.new_password !== data.old_password, {
    message: "New password can't be the same as your old password.",
    path: ['new_password'], // path of error
  });

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm({ session }: { session: Session }) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: session.user.email,
    },
  });

  function onSubmit(data: AccountFormValues) {
    toast('You submitted the following values:', {
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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
                <FormLabel>Email</FormLabel>
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
            name='old_password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='Old password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='new_password'
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
            <Button type='submit'>Update account</Button>
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
            onClick={async () => await signOut({ scope: 'global' })}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
