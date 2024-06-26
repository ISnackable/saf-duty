import type { Metadata } from 'next';

import { Icons } from '@/components/icons';
import { SwapDuty } from '@/components/swap-duty';

export const metadata: Metadata = {
  title: 'Swap Duties',
  description: 'Swap duties with other duty personnels',
};

export default async function SwapDutiesPage() {
  return (
    <div className='space-y-4 p-8 pt-4'>
      <div className='flex w-full items-center space-y-2'>
        <Icons.arrowExchange className='mr-3 inline-block h-8 w-8 items-center align-middle' />
        <h1 className='grow scroll-m-20 border-b pb-2 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
          Swap Duties
        </h1>
      </div>
      <p className='text-sm leading-7 sm:text-base [&:not(:first-child)]:mt-6'>
        Here you can see all the swap duties requests you have received and
        sent.
      </p>
      <SwapDuty />
    </div>
  );
}
