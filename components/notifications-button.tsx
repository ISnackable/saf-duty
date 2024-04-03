'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { insertSubscription } from '@/app/(dashboard)/actions';
import { InstallPWA } from '@/components/install-pwa';
import { usePushNotificationContext } from '@/components/push-notification-provider';
import { useSession } from '@/components/session-provider';
import { Button } from '@/components/ui/button';
import { useOs } from '@/hooks/use-os';
import { isDemoUser } from '@/utils/helper';

export function NotificationsButton() {
  const session = useSession();
  const {
    userSubscription,
    userConsent,
    isPWAInstalled,
    pushNotificationSupported,
    onClickAskUserPermission,
    onClickSubscribeToPushNotification,
  } = usePushNotificationContext();
  const os = useOs();
  const [open, setOpen] = useState(false);

  return (
    ((session && isDemoUser(session.user.id)) || userSubscription === null) && (
      <InstallPWA open={open} onOpenChange={setOpen}>
        <Button
          variant='outline'
          size='sm'
          className='rounded-full'
          onClick={async () => {
            if (userSubscription !== null) return;

            if (os === 'ios' || os === 'android' || os === 'undetermined') {
              if (!isPWAInstalled || !pushNotificationSupported) {
                setOpen((prev) => !prev);
                return;
              }
            }

            if (!session) return;

            if (isDemoUser(session.user.id)) {
              toast.warning('Demo users cannot enable notifications');
              return;
            }

            if (userConsent === 'default') {
              await onClickAskUserPermission();

              toast.warning('Please click again to enable notifications');
            } else if (userConsent === 'granted') {
              const subscription = await onClickSubscribeToPushNotification();

              if (!subscription) {
                toast.error('You have blocked notifications');
                return;
              }

              const { serverError, validationErrors } =
                await insertSubscription(subscription?.toJSON() as any);

              if (serverError || validationErrors) {
                toast.error('Something went wrong');
                return;
              }

              toast.success(`subscribed to push notifications`);
            } else {
              toast.error('You have blocked notifications');
            }
          }}
        >
          Turn on notifications
        </Button>
      </InstallPWA>
    )
  );
}
