import { type Session } from '@supabase/supabase-js';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { GenerateDuty } from '@/components/generate-duty';
import { Icons } from '@/components/icons';
import { demoUsers, isDemoUser } from '@/lib/demo-data';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Generate Duty',
  description: 'Admin page to generate duty roster.',
};

async function getDutyRoster(session: Session) {}

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/login');
  }

  return (
    <div className='space-y-4 p-8 pt-6'>
      <div className='flex items-center space-y-2 w-full'>
        <Icons.edit className='inline-block w-8 h-8 mr-3 align-middle items-center' />
        <h1 className='scroll-m-20 border-b pb-2 text-4xl font-extrabold tracking-tight lg:text-5xl grow'>
          Generate Duty
        </h1>
      </div>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        Generate the duty roster for the selected month & year with the given
        personnels. The algorithm will try to generate the duty roster such that
        each personnel will have an equal number of duty days and duty weekends
        and try to make sure that the duty personnel/stand in has less than 2
        consecutive days of duty/standby. It uses weekendPoints and
        weekdayPoints to determine the number of duty days and duty weekends.
        Personnel with lower points will have more duty.
      </p>

      <Suspense fallback={<p>Loading feed...</p>}>
        <GenerateDuty />
      </Suspense>
    </div>
  );
}
