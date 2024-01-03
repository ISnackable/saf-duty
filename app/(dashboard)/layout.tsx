import { type Session } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

import { BottomNav } from '@/components/bottom-nav';
import { Header } from '@/components/header';
import { SideNav } from '@/components/side-nav';
import { demoUsers, isDemoUser } from '@/lib/demo-data';
import { createClient } from '@/utils/supabase/server';

async function getUserProfileData(session: Session) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (isDemoUser(session.user.id)) {
    return {
      name: demoUsers[0].name,
      avatar_url: demoUsers[0].avatar_url,
    };
  } else {
    const profileQuery = supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', session.user.id)
      .single();

    const { data, error } = await profileQuery;

    if (!data || error) {
      throw new Error('Failed to fetch profile');
    }

    return data;
  }
}

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

  const data = await getUserProfileData(session);

  return (
    <section className='flex min-h-screen'>
      <nav>
        <Header session={session} profile={data} />

        <SideNav className='fixed hidden border-r xl:flex' session={session} />
      </nav>

      <div className='md:container md:mx-auto mt-16 pb-8 xl:pl-[256px] mb-12 sm:mb-0'>
        {children}
      </div>
      <BottomNav />
    </section>
  );
}
