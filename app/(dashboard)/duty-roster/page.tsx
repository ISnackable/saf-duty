import type { Metadata } from 'next';

import { DutyRoster } from '@/components/duty-roster';
import { Icons } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Duty Roster',
  description: 'View the duty roster and request for swap duty.',
};

export default async function DutyRosterPage() {
  return (
    <div className='space-y-4 p-8 pt-4'>
      <div data-tour='duty-roster-page'>
        <div className='flex w-full items-center space-y-2'>
          <Icons.calendar className='mr-3 inline-block h-8 w-8 items-center align-middle' />
          <h1 className='grow scroll-m-20 border-b pb-2 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
            Duty Roster
          </h1>
        </div>
        <p className='text-sm leading-7 sm:text-base [&:not(:first-child)]:mt-6'>
          View the duty roster, below the date indicate the duty personnel while
          the circle bracket indicates the duty stand in personnel. Click on the
          date to request for swap duty.
        </p>
      </div>
      <DutyRoster />
    </div>
  );
}
