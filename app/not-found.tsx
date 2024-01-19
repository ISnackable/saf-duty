import { Metadata, Viewport } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: '404 Not Found',
  description: 'Not Found',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#101214' },
  ],
};

export default function NotFound() {
  return (
    <section className='grid h-screen place-content-center px-4'>
      <div className='text-center'>
        <h1 className='text-9xl font-black'>404</h1>

        <p className='text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200 sm:text-4xl'>
          Uh-oh!
        </p>

        <p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
          We can&apos;t find that page.
        </p>

        <Button asChild className='mt-6'>
          <Link href='/'>Go Back Home</Link>
        </Button>
      </div>
    </section>
  );
}
