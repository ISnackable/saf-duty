'use client';

import { type Session } from '@supabase/supabase-js';
import {
  IconDotsVertical,
  IconShare2,
  IconSquarePlus,
} from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza';
import usePushNotifications from '@/hooks/use-push-notification';
import { useOs } from '@/hooks/use.os';
import { APP_NAME } from '@/site.config';
import { isDemoUser } from '@/utils/demo';

import { Icons } from './icons';

export function NotificationsButton({ session }: { session: Session }) {
  const {
    userSubscription,
    userConsent,
    isPWAInstalled,
    pushNotificationSupported,
    onClickAskUserPermission,
    onClickSubscribeToPushNotification,
  } = usePushNotifications();
  const os = useOs();
  const [open, setOpen] = useState(false);

  return (
    userSubscription === null && (
      <Credenza open={open} onOpenChange={setOpen}>
        {/* // Show guide on how to install PWA if not a PWA app, else just navigate to notifcation page */}
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

            if (isDemoUser(session.user.id)) {
              toast.warning('Demo users cannot enable notifications');
              return;
            }

            if (userConsent === 'default') {
              await onClickAskUserPermission();
              await onClickSubscribeToPushNotification();
              toast.success('requested permission');
            } else if (userConsent === 'granted') {
              await onClickSubscribeToPushNotification();
              toast.success(`subscribed to push notifications`);
            } else {
              toast.error('You have blocked notifications');
            }
          }}
        >
          Turn on notifications
        </Button>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>
              <div className='flex w-full items-center justify-center gap-1 text-3xl font-medium'>
                <Icons.logo className='h-12 w-12' />
                {APP_NAME || 'APP NAME'}
              </div>
            </CredenzaTitle>
            <CredenzaDescription>
              To enable notifications, you need to install the app and enable
              push notifications.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <h5 className='text-md scroll-m-20 font-semibold tracking-tight'>
              Follow these steps to install the app:
            </h5>
            <ul className='mb-4 ml-6 list-decimal [&>li]:mt-2'>
              <li>
                Tap on
                <Button
                  variant='outline'
                  size='icon'
                  className='mx-2 h-8 w-8 bg-muted align-middle hover:bg-muted'
                >
                  {os === 'android' ? (
                    <IconDotsVertical size='1rem' />
                  ) : (
                    <IconShare2 className='h-6 w-6 text-blue-400' />
                  )}
                </Button>
                {os === 'android' ? 'in Chrome nav bar' : 'in Safari tab bar'}
              </li>
              <li>
                Scroll and select{' '}
                <code className='relative rounded border border-input bg-muted px-[0.4rem] py-[0.3rem] text-sm font-bold'>
                  Add to Home Screen{' '}
                  <IconSquarePlus className='inline h-4 w-4 align-middle' />
                </code>
              </li>
              <li>
                Look for the
                <Button
                  variant='outline'
                  size='icon'
                  className='mx-2 h-8 w-8 bg-muted align-middle hover:bg-muted'
                >
                  <Icons.logo className='h-12 w-12' />
                </Button>
                icon on your home screen
              </li>
            </ul>
            {JSON.stringify(userConsent, null, 2)}
            {'serviceWorker' in navigator ? 'true' : 'false'}
            {JSON.stringify(userSubscription, null, 2)}
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button variant='outline'>Close</Button>
            </CredenzaClose>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    )
  );
}
