'use client';

import { useEffect } from 'react';

import { signOut } from '@/app/(auth)/actions';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <section className='grid h-screen place-content-center px-4'>
      <div className='mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16'>
        <div className='mx-auto max-w-screen-sm text-center'>
          <h1 className='text-primary-600 dark:text-primary-500 mb-4 text-9xl font-black  tracking-tight lg:text-9xl'>
            500
          </h1>
          <p className='mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200 sm:text-4xl   md:text-4xl'>
            Internal Server Error.
          </p>
          <p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
            We are already working to solve the problem.{' '}
          </p>

          <div className='mt-6 flex items-center justify-center gap-2 align-middle'>
            <Button
              variant='secondary'
              onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
              }
            >
              Try again
            </Button>
            <Button variant='destructive' onClick={async () => await signOut()}>
              Log out
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
