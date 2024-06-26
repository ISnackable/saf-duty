import type { Metadata } from 'next';

import { Icons } from '@/components/icons';
import { ORD } from '@/components/ord';

export const metadata: Metadata = {
  title: 'ORD',
  description: 'A ORD count down page',
};

export default async function CollectionsORDPage() {
  return (
    <div className='space-y-4 p-8 pt-4'>
      <div className='flex w-full items-center space-y-2'>
        <Icons.calendarStats className='mr-3 inline-block h-8 w-8 items-center align-middle' />
        <h1 className='grow scroll-m-20 border-b pb-2 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
          ORD
        </h1>
      </div>
      <p className='text-sm leading-7 sm:text-base [&:not(:first-child)]:mt-6'>
        ORD is the date when full-time national servicemen (Singaporean Males)
        complete their 2 years (previously 2.5 years) compulsory service in the
        Singapore Army, Navy, Police or Civil Defence Force.
      </p>

      <ORD />
    </div>
  );
}
