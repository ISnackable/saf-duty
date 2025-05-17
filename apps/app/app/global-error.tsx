'use client';

import { signOut } from '@repo/auth/client';
import { Button } from '@repo/design-system/components/ui/button';
import { fonts } from '@repo/design-system/lib/fonts';
import { log } from '@repo/observability/log';
import type NextError from 'next/error';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

type GlobalErrorProperties = {
  readonly error: NextError & { digest?: string };
  readonly reset: () => void;
};

const GlobalError = ({ error, reset }: GlobalErrorProperties) => {
  useEffect(() => {
    if (error?.digest) {
      log.error('500', error);
    }
  }, [error]);

  return (
    <html lang="en" className={fonts}>
      <body>
        <section className="grid h-screen place-content-center px-4">
          <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
            <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="mb-4 font-black text-9xl text-primary-600 tracking-tight lg:text-9xl dark:text-primary-500">
                500
              </h1>
              <p className="mb-4 font-bold text-2xl text-gray-900 tracking-tight sm:text-4xl md:text-4xl dark:text-gray-200">
                Internal Server Error.
              </p>
              <p className="mb-4 font-light text-gray-500 text-lg dark:text-gray-400">
                We are already working to solve the problem.{' '}
              </p>

              <div className="mt-6 flex items-center justify-center gap-2 align-middle">
                <Button
                  variant="secondary"
                  onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                  }
                >
                  Try again
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          redirect('/login');
                        },
                      },
                    });
                    if (navigator?.setAppBadge) {
                      navigator.setAppBadge(0);
                    }
                  }}
                >
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
};

export default GlobalError;
