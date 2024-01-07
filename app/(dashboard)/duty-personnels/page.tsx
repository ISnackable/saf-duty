import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Icons } from '@/components/icons';
// import { demoUsers, isDemoUser } from '@/lib/demo-data';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Duty Personnels',
  description: 'View duty personnels',
};

export default async function DutyPersonnelsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/login');
  }

  return (
    <div className='space-y-4 p-8 pt-4'>
      <div className='flex items-center space-y-2 w-full'>
        <Icons.edit className='inline-block w-8 h-8 mr-3 align-middle items-center' />
        <h1 className='scroll-m-20 border-b pb-2 text-2xl sm:text-4xl font-extrabold tracking-tight lg:text-5xl grow'>
          Duty Personnels
        </h1>
      </div>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>... WORDS ...</p>
    </div>
  );
}
