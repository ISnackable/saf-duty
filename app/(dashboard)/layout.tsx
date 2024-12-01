import { redirect } from 'next/navigation';

import { AppSidebar } from '@/components/app-sidebar';
import { BottomNav } from '@/components/bottom-nav';
import { DriverTour } from '@/components/driver-tour';
import { Header } from '@/components/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
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
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />

          <section className='mb-12 pb-8 md:container sm:mb-0 md:mx-auto xl:pl-[256px]'>
            {children}
          </section>

          <footer>
            <BottomNav />
          </footer>
        </SidebarInset>

        {data?.onboarded ? null : <DriverTour />}
      </SidebarProvider>
    </>
  );
}
