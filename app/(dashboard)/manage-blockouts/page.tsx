import { type Session } from '@supabase/supabase-js';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Icons } from '@/components/icons';
import { ManageBlockoutCalendar } from '@/components/manage-blockout-calendar';
import { demoUsers, isDemoUser } from '@/lib/demo-data';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app built using the components.',
};

async function getUserData(session: Session) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (isDemoUser(session.user.id)) {
    return {
      max_blockouts: demoUsers[0].max_blockouts,
      blockout_dates: demoUsers[0].blockout_dates,
    };
  } else {
    const profileQuery = supabase
      .from('profiles')
      .select('max_blockouts, blockout_dates')
      .eq('id', session.user.id)
      .single();

    const { data, error } = await profileQuery;

    if (!data || error) {
      throw new Error('Failed to fetch profile');
    }

    return data;
  }
}

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/login');
  }

  const data = await getUserData(session);

  return (
    <div className='space-y-4 p-8 pt-6'>
      <div className='flex items-center space-y-2 w-full'>
        <Icons.edit className='inline-block w-8 h-8 mr-3 align-middle items-center' />
        <h1 className='scroll-m-20 border-b pb-2 text-4xl font-extrabold tracking-tight lg:text-5xl grow'>
          Manage Blockouts
        </h1>
      </div>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        View and manage your blockouts. The day you selected will be your
        blockout date,{' '}
        <u className='font-medium text-primary underline underline-offset-4'>
          make sure to save
        </u>{' '}
        after you are done.
      </p>
      <ul className='list-disc ml-5 dark:text-gray-200'>
        <li>
          Only a maximum of {data.max_blockouts} blockouts date per month
          (subject to change)
        </li>
        <li>Inform the person-in-charge if you need more blockouts</li>
        <li>
          You are not allowed to blockout every weekend & friday of the month
        </li>
      </ul>

      <ManageBlockoutCalendar profile={data} />
    </div>
  );
}
