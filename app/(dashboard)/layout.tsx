import { cookies } from 'next/headers';

import { BottomNav } from '@/components/bottom-nav';
import { Header } from '@/components/header';
import { SideNav } from '@/components/side-nav';
import { getUserProfileData } from '@/lib/supabase/data';
import { createClient } from '@/utils/supabase/server';

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

  const data = await getUserProfileData(supabase, session);

  return (
    <section>
      <nav className='flex'>
        <Header session={session} profile={data} />

        <SideNav className='fixed hidden border-r xl:flex' session={session} />
      </nav>

      <div className='mb-12 mt-16 pb-8 md:container sm:mb-0 md:mx-auto xl:pl-[256px]'>
        {children}
      </div>
      <BottomNav />
    </section>
  );
}
