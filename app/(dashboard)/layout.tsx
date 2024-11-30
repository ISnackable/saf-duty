import { redirect } from 'next/navigation';

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
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  const data = await getUserProfileData(supabase, session.user);

  return (
    <>
      <nav className='flex'>
        <Header />

        <SideNav className='fixed hidden border-r xl:flex' />
      </nav>

      <section className='mb-12 mt-16 pb-8 md:container sm:mb-0 md:mx-auto xl:pl-[256px]'>
        {children}
      </section>

      <footer>
        <BottomNav />
      </footer>

      {data?.onboarded ? null : <DriverTour />}
    </>
  );
}
