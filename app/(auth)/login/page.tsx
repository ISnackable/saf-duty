import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { UserLoginForm } from '@/components/user-login-form';
import svgImage from '@/public/undraw_fingerprint_re_uf3f.svg';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default function LoginPage() {
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
            Welcome back
          </h1>
          <p className='text-sm text-muted-foreground'>
            Enter your email to sign in to your account
          </p>
        </div>
        <UserLoginForm />
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
