import { cookies } from 'next/headers';

import { NotificationsForm } from '@/components/notifications-form';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/utils/supabase/server';

export default async function SettingsNotificationsPage() {
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
        <h3 className='text-lg font-medium'>Notifications</h3>
        <p className='text-sm text-muted-foreground'>
          Configure how you receive notifications.
        </p>
      </div>
      <Separator />
      <NotificationsForm session={session} />
    </div>
  );
}
