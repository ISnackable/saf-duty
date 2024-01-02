import { Metadata, Viewport } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: '404 Not Found',
  description: 'Not Found',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function NotFound() {
  return (
    <div className='grid h-screen place-content-center px-4'>
      <div className='text-center'>
        <h1 className='text-9xl font-black '>404</h1>

        <p className='text-2xl font-bold tracking-tight dark:text-gray-200 text-gray-900 sm:text-4xl'>
          Uh-oh!
        </p>

        <p className='mt-4 dark:text-gray-100 text-gray-500'>
          We can&apos;t find that page.
        </p>

        <Button asChild className='mt-6'>
          <Link href='/'>Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
}
