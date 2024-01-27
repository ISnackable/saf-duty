import { cookies } from 'next/headers';

import { ProfileForm } from '@/components/profile-form';
import { Separator } from '@/components/ui/separator';
import { getUserProfileData } from '@/lib/supabase/data';
import { createClient } from '@/utils/supabase/server';

export default async function SettingsProfilePage() {
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
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Profile</h3>
        <p className='text-sm text-muted-foreground'>
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm profile={data} />
    </div>
  );
}
