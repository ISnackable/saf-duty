import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { PasswordInput } from '@/components/password-input';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserLoginForm } from '@/components/user-login-form';
import { name } from '@/lib/config';
import { cn } from '@/lib/utils';
import svgImage from '@/public/undraw_fingerprint_re_uf3f.svg';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

function UserLoginFormFallback() {
  return (
    <div className='grid gap-6'>
      <form>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <button
              type='button'
              tabIndex={-1}
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
            />
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
            <PasswordInput id='password' autoComplete='password' />
          </div>
          <button type='submit' className={cn(buttonVariants())}>
            Sign In with Email
          </button>
        </div>
      </form>
    </div>
  );
}

export default async function LoginPage() {
  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <div className='relative h-[30vh]'>
            <Image
              priority
              src={svgImage}
              fill={true}
              alt='Undraw personal information logo'
              className='object-contain'
            />
          </div>

          <h1 className='text-2xl font-semibold tracking-tight'>
            Welcome back to {name}!
          </h1>
        </div>

        <Suspense fallback={<UserLoginFormFallback />}>
          <UserLoginForm />
        </Suspense>

        <p className='px-8 text-center text-sm text-muted-foreground'>
          <Link
            href='/register'
            className='hover:text-brand underline underline-offset-4'
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
