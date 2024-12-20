import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import svgImage from '@/public/undraw_exciting_news_re_y1iw.svg';
import { UserRegisterForm } from '@repo/design-system/components/sign-up';
import { buttonVariants } from '@repo/design-system/components/ui/button';
import { cn } from '@repo/design-system/lib/utils';

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
};

export default function RegisterPage() {
  return (
    <div className="container grid h-screen flex-col items-center justify-center lg:max-w-none lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 md:top-8 md:right-8'
        )}
      >
        Login
      </Link>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="relative mt-12 h-[30vh]">
              <Image
                priority
                src={svgImage}
                fill={true}
                alt="Undraw personal information logo"
                className="object-contain"
              />
            </div>

            <h1 className="font-semibold text-2xl tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your email below to create your account
            </p>
          </div>
          <UserRegisterForm />
          <p className="px-8 pb-4 text-center text-muted-foreground text-sm">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-brand"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-brand"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
