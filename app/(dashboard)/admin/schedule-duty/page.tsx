import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { GenerateDuty } from '@/components/generate-duty';
import { Icons } from '@/components/icons';
import { createClient } from '@/lib/supabase/clients/server';
import { getRosterData, getUsersProfileData } from '@/lib/supabase/data';
import { getMonthYearParams } from '@/utils/helper';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Schedule Duty',
  description: 'Admin page to schedule duty roster.',
};

export default async function AdminScheduleDutyPage(props: {
  searchParams?: Promise<{
    month?: string;
    year?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const { month, year } = getMonthYearParams(searchParams);

  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }
  const [roster, users] = await Promise.all([
    getRosterData(supabase, session.user, month, year),
    getUsersProfileData(supabase, session.user),
  ]);

  return (
    <div className='space-y-4 p-8 pt-4'>
      <div className='flex w-full items-center space-y-2'>
        <Icons.chessKnight className='mr-3 inline-block h-8 w-8 items-center align-middle' />
        <h1 className='grow scroll-m-20 border-b pb-2 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
          Schedule Duty
        </h1>
      </div>
      <p className='text-sm leading-7 sm:text-base [&:not(:first-child)]:mt-6'>
        Generate the duty roster for the selected month & year with the given
        personnels. The algorithm uses &quot;points&quot; to determine the
        number of duty days. Personnel with lower &quot;points&quot; will have
        more duty.
      </p>
      <GenerateDuty roster={roster} users={users} month={month} year={year} />
    </div>
  );
}
