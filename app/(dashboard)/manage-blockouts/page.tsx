import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Highlight } from '@/components/highlight';
import { Icons } from '@/components/icons';
import { ManageBlockout } from '@/components/manage-blockout';
import { getUserBlockoutData } from '@/lib/supabase/data';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Manage Blockouts',
  description: 'Manage your blockouts.',
};

export default async function ManageBlockoutsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const data = await getUserBlockoutData(supabase, session);

  return (
    <div className='space-y-4 p-8 pt-4'>
      <div className='flex w-full items-center space-y-2'>
        <Icons.edit className='mr-3 inline-block h-8 w-8 items-center align-middle' />
        <h1 className='grow scroll-m-20 border-b pb-2 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
          Manage Blockouts
        </h1>
      </div>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        View and manage your blockouts. The day you selected will be your
        blockout date, <Highlight>make sure to save</Highlight> after you are
        done.
      </p>
      <ul className='ml-5 list-disc dark:text-gray-200'>
        <li>
          Only a maximum of {data.max_blockouts} blockouts date per month
          (subject to change)
        </li>
        <li>
          You are not allowed to blockout every{' '}
          <u className='font-medium text-primary underline underline-offset-4'>
            weekend & friday
          </u>{' '}
          of the month
        </li>
      </ul>

      {/* No Suspend Here as it's apparently super fast */}
      <ManageBlockout profile={data} />
    </div>
  );
}
