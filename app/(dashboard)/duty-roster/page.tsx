import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { DutyRoster } from '@/components/duty-roster';
import { Icons } from '@/components/icons';
import { getRosterData } from '@/lib/supabase/data';
import { getMonthYearParams } from '@/utils/get-search-params';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Manage User',
  description: 'Admin page to schedule duty roster.',
};

export const revalidate = 0;

export default async function DutyRosterPage({
  searchParams,
}: {
  searchParams?: {
    month?: string;
    year?: string;
  };
}) {
  const { month, year } = getMonthYearParams(searchParams);

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/login');
  }

  const roster = await getRosterData(supabase, session.user, month, year);

  return (
    <div className='space-y-4 p-8 pt-4'>
      <div data-tour='duty-roster-page'>
        <div className='flex w-full items-center space-y-2'>
          <Icons.edit className='mr-3 inline-block h-8 w-8 items-center align-middle' />
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
      <DutyRoster session={session} roster={roster} month={month} year={year} />
    </div>
  );
}
