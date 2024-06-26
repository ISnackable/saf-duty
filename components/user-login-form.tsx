'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { signIn } from '@/app/(auth)/actions';
import { Icons } from '@/components/icons';
import { PasswordInput } from '@/components/password-input';
import { customNotifyEvent } from '@/components/session-provider';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { demo } from '@/lib/config';
import { cn } from '@/lib/utils';
import { loginFormSchema } from '@/lib/validation';

type UserLoginFormProps = React.HTMLAttributes<HTMLDivElement>;

export type LoginFormData = z.infer<typeof loginFormSchema>;

export function UserLoginForm({ className, ...props }: UserLoginFormProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleLoginForm(data: LoginFormData) {
    setIsLoading(true);
    const { data: session, status, message } = await signIn(data);

    if (status === 'error') {
      toast.error(message || 'Something went wrong.', {
        description: 'Your sign in request failed. Please try again.',
      });
      setIsLoading(false);
    } else {
      toast.success(message || 'Successfully logged in.', {
        description:
          'Your sign in request was successful. You will be redirected shortly.',
      });

      customNotifyEvent('SIGNED_IN', session);
      const redirect = searchParams.get('redirect');

      // redirect to dashboard
      router.replace(redirect ? redirect : '/');
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(handleLoginForm)}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <button
              type='button'
              disabled={isLoading}
              aria-disabled={isLoading}
              tabIndex={-1}
              onClick={() => {
                setValue('email', demo.email);
                setValue('password', demo.password);
                handleSubmit(handleLoginForm)();
              }}
              className='text-pretty p-2 pt-0 text-xs text-muted-foreground underline-offset-2 hover:underline'
            >
              Interested but lazy to create an account? Click here to login as
              demo user to see the app in action
            </button>

            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
              {...register('email')}
            />
            {errors?.email && (
              <p className='px-1 text-xs text-red-600'>
                {errors.email.message}
              </p>
            )}
          </div>
          <div className='mb-2 grid gap-1'>
            <div className='flex justify-between'>
              <Label htmlFor='password'>Password</Label>

              <Link
                href='/reset-password'
                className='hover:text-brand text-sm underline-offset-4 hover:underline'
                tabIndex={-1}
              >
                Forgot Password?
              </Link>
            </div>
            <PasswordInput
              id='password'
              autoComplete='password'
              disabled={isLoading}
              {...register('password')}
            />
            {errors?.password && (
              <p className='px-1 text-xs text-red-600'>
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type='submit'
            className={cn(buttonVariants())}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Sign In with Email
          </button>
        </div>
      </form>
    </div>
  );
}
