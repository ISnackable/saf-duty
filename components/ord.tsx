'use client';

import Link from 'next/link';
import * as React from 'react';

import { BackgroundGradient } from '@/components/background-gradient';
import { Gauge } from '@/components/ui/gauge';
import { useProfiles } from '@/hooks/use-profiles';

const TODAY = new Date();

export function ORD() {
  const { data: profiles } = useProfiles();

  if (profiles && profiles?.ord_date) {
    let totalDuration = new Date(profiles.ord_date).getTime() - TODAY.getTime();

    if (totalDuration < 0) totalDuration = 0;
    else if (totalDuration > 730 * (1000 * 3600 * 24))
      totalDuration = 730 * (1000 * 3600 * 24);

    const totalDays = Math.floor(totalDuration / (1000 * 3600 * 24));
    const progress = Math.floor(100 - (totalDays / 730) * 100);

    return (
      <div className='mx-auto min-h-[350px] max-w-xl items-center justify-center p-10'>
        <BackgroundGradient className='max-w-xl rounded-[22px] bg-white p-10 dark:bg-zinc-900'>
          <p className='mb-4 text-center text-base text-black sm:text-xl dark:text-neutral-200'>
            Days left to ORD
          </p>

          <div className='relative flex flex-col items-center justify-center'>
            <Gauge value={progress} showValue={false} className='size-36' />
            <div className='absolute flex animate-gauge-fadeIn opacity-0'>
              <p className='text-3xl text-gray-100'>{totalDays}</p>
            </div>
          </div>

          <p className='mt-4 text-center text-sm text-neutral-600 dark:text-neutral-400'>
            {progress}% completed
          </p>

          <blockquote className='mt-6 border-l-2 pl-6 italic'>
            ORD loh!! 🎉 — {profiles?.name}
          </blockquote>
        </BackgroundGradient>
      </div>
    );
  }

  return (
    <div className='mx-auto min-h-[350px] max-w-xl items-center justify-center p-10'>
      <BackgroundGradient className='max-w-xl rounded-[22px] bg-white p-10 dark:bg-zinc-900'>
        <p className='leading-7 text-destructive [&:not(:first-child)]:mt-6'>
          ORD date is not set. Head over to your{' '}
          <Link
            href='/settings'
            className='font-medium text-primary underline underline-offset-4'
          >
            profile page
          </Link>{' '}
          to set your ORD date. Once you&apos;ve set your ORD date, you&apos;ll
          be able to see the countdown here.
        </p>

        <blockquote className='mt-6 border-l-2 pl-6 italic'>
          ORD loh!! 🎉
          <br />— {profiles?.name}
        </blockquote>
      </BackgroundGradient>
    </div>
  );
}
