import { cookies } from 'next/headers';

import { BottomNav } from '@/components/bottom-nav';
import { DriverTour } from '@/components/driver-tour';
import { Header } from '@/components/header';
import { SideNav } from '@/components/side-nav';
import { createClient } from '@/lib/supabase/clients/server';
import { getUserProfileData } from '@/lib/supabase/data';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <section>
      <nav className='flex'>
        <Header />

        <SideNav className='fixed hidden border-r xl:flex' />
      </nav>

      <div className='mb-12 mt-16 pb-8 md:container sm:mb-0 md:mx-auto xl:pl-[256px]'>
        {children}
      </div>
      <BottomNav />
      {data?.onboarded ? null : <DriverTour />}
    </section>
  );
}
