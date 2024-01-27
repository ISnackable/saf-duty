import { cookies } from 'next/headers';

import { AccountForm } from '@/components/account-form';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/utils/supabase/server';

export default async function SettingsAccountPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('No session');
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Account</h3>
        <p className='text-sm text-muted-foreground'>
          Update your account settings. Set your preferred language and
          timezone.
        </p>
      </div>
      <Separator />
      <AccountForm session={session} />
    </div>
  );
}
