import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { DashboardOverview } from '@/components/dashboard-overview';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserProfileData } from '@/lib/supabase/data';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Overview',
  description: 'Dashboard overview for duty personnels',
};

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('No session');
  }

  const data = await getUserProfileData(supabase, session.user);

  return (
    <div className='space-y-4 p-8 pt-4'>
      <div data-tour='home-page'>
        <div className='flex w-full items-center space-y-2'>
          <Avatar className='mr-3 inline-block h-10 w-10 items-center align-middle'>
            <AvatarImage src={data.avatar_url ?? ''} />
            <AvatarFallback>{data.name}</AvatarFallback>
          </Avatar>
          <h1 className='grow scroll-m-20 border-b pb-2 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
            Howdy, {data.name}
          </h1>
        </div>
        <p className='text-sm leading-7 sm:text-base [&:not(:first-child)]:mt-6'>
          Review your upcoming duties and add them to your calendar.
        </p>
      </div>

      <DashboardOverview />
    </div>
  );
}
