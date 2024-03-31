import type { Metadata } from 'next';
import Link from 'next/link';

import { Icons } from '@/components/icons';

export const metadata: Metadata = {
  title: 'IPPT',
  description: 'IPPT page to calculate your IPPT score.',
};

export default async function CollectionsIPPTPage() {
  return (
    <div className='space-y-4 p-8 pt-4'>
      <div className='flex w-full items-center space-y-2'>
        <Icons.sparkles className='mr-3 inline-block h-8 w-8 items-center align-middle' />
        <h1 className='grow scroll-m-20 border-b pb-2 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
          IPPT Calculator
        </h1>
      </div>
      <p className='text-sm leading-7 sm:text-base [&:not(:first-child)]:mt-6'>
        This is an embed of{' '}
        <Link
          href='https://ippt.yctay.com'
          className='hover:text-brand underline underline-offset-4'
        >
          ippt.yctay.com
        </Link>
        . If you&apos;re exempted from any of the stations, check out the
        official{' '}
        <Link
          className='hover:text-brand underline underline-offset-4'
          href='https://www.ns.sg/web/portal/nsmen/home/nstopics/ippt-nsfit/ippt/ippt-stations-and-scoring-system/scoring-calculation'
        >
          IPPT calculator on NS.SG
        </Link>
      </p>

      <iframe
        src='https://ippt.yctay.com/?age=20&situpReps=33&pushupReps=20&runMins=12&runSecs=30'
        width='100%'
        height='100%'
        style={{
          border: 'none',
          height: '75vh' /* Viewport-relative units */,
        }}
        sandbox='allow-scripts allow-same-origin'
      />
    </div>
  );
}
