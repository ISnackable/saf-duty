import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Icons } from '@/components/icons';
// import { demoUsers, isDemoUser } from '@/lib/demo-data';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Manage Personnel',
  description: 'Admin page to manage duty personnels.',
};

export default async function AdminManagePersonnelPage() {
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
      <div className='flex w-full items-center space-y-2'>
        <Icons.edit className='mr-3 inline-block h-8 w-8 items-center align-middle' />
        <h1 className='grow scroll-m-20 border-b pb-2 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
          Manage Personnel
        </h1>
      </div>
      <p className='text-sm leading-7 sm:text-base [&:not(:first-child)]:mt-6'>
        ... WORDS ...
      </p>
    </div>
  );
}