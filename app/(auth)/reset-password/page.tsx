import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { UserResetForm } from '@/components/user-reset-form';
import svgImage from '@/public/undraw_forgot_password_re_hxwm.svg';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset Your Password',
};

export default function ResetPasswordPage() {
  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <div className='relative h-[25vh] mb-5'>
            <Image
              priority
              src={svgImage}
              fill={true}
              alt='Undraw personal information logo'
              className='object-contain'
            />
          </div>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Reset Your Password
          </h1>
          <p className='text-sm text-muted-foreground'>
            Type in your email and we&apos;ll send you a link to reset your
            password
          </p>
        </div>
        <UserResetForm />
        <p className='px-8 text-center text-sm text-muted-foreground'>
          <Link
            href='/login'
            className='hover:text-brand underline underline-offset-4'
          >
            Go back to the login page
          </Link>
        </p>
      </div>
    </div>
  );
}
