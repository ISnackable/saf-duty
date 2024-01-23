import { type Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { GenerateDuty } from '@/components/generate-duty';
import { Icons } from '@/components/icons';
import { getRosterData, getUsersData } from '@/lib/supabase/data';
import { getMonthYearParams } from '@/utils/get-search-params';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Schedule Duty',
  description: 'Admin page to schedule duty roster.',
};

export default async function AdminScheduleDutyPage({
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
    redirect('/login');
  }

  const [roster, users] = await Promise.all([
    getRosterData(supabase, session, month, year),
    getUsersData(supabase, session),
  ]);

  return (
    <div className='space-y-4 p-8 pt-4'>
      <div className='flex w-full items-center space-y-2'>
        <Icons.edit className='mr-3 inline-block h-8 w-8 items-center align-middle' />
        <h1 className='grow scroll-m-20 border-b pb-2 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
          Schedule Duty
        </h1>
      </div>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        Generate the duty roster for the selected month & year with the given
        personnels. The algorithm uses &quot;points&quot; to determine the
        number of duty days. Personnel with lower &quot;points&quot; will have
        more duty.
      </p>
      <GenerateDuty roster={roster} users={users} month={month} year={year} />
    </div>
  );
}
