import type { Metadata } from 'next';

import { Highlight } from '@/components/highlight';
import { Icons } from '@/components/icons';
import {
  MAXIMUM_BLOCKOUTS,
  ManageBlockout,
} from '@/components/manage-blockout';

export const metadata: Metadata = {
  title: 'Manage Blockouts',
  description: 'Manage your blockouts.',
};

export default async function ManageBlockoutsPage() {
  return (
    <div className='space-y-4 p-8 pt-4'>
      <div className='flex w-full items-center space-y-2'>
        <Icons.edit className='mr-3 inline-block h-8 w-8 items-center align-middle' />
        <h1
          className='grow scroll-m-20 border-b pb-2 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'
        >
          Manage Blockouts
        </h1>
      </div>
      <p className='text-sm leading-7 sm:text-base [&:not(:first-child)]:mt-6'>
        View and manage your blockouts. The day you selected will be your
        blockout date, <Highlight>make sure to save</Highlight> after you are
        done.
      </p>
      <ul className='ml-5 list-disc text-sm sm:text-base dark:text-gray-200'>
        <li>
          Only a maximum of{' '}
          <u className='font-medium text-primary underline underline-offset-4'>
            {MAXIMUM_BLOCKOUTS}
          </u>{' '}
          blockouts date per month (can request for more, but subject to review)
        </li>
        <li>
          You are not allowed to blockout every{' '}
          <u className='font-medium text-primary underline underline-offset-4'>
            weekend & friday
          </u>{' '}
          of the month
        </li>
      </ul>

      <ManageBlockout />
    </div>
  );
}
