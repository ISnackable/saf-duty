import type { Metadata } from 'next';

import { Icons } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Duty Personnels',
  description: 'View duty personnels',
};

export default async function DutyPersonnelsPage() {
  return (
    <div className='space-y-4 p-8 pt-4'>
      <div className='flex w-full items-center space-y-2'>
        <Icons.users className='mr-3 inline-block h-8 w-8 items-center align-middle' />
        <h1 className='grow scroll-m-20 border-b pb-2 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
          Duty Personnels
        </h1>
      </div>
      <p className='text-sm leading-7 sm:text-base [&:not(:first-child)]:mt-6'>
        ... WORDS ...
      </p>
    </div>
  );
}
