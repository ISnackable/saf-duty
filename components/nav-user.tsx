'use client';

import { useState } from 'react';

import { signOut } from '@/app/(auth)/actions';
import { InstallPWA } from '@/components/install-pwa';
import { ProgressBarLink } from '@/components/progress-bar';
import { usePushNotificationContext } from '@/components/push-notification-provider';
import { customNotifyEvent } from '@/components/session-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProfiles } from '@/hooks/use-profiles';

export function NavUser({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: profile } = useProfiles();
  const { onClickUnsubscribeToPushNotification, pushNotificationSupported } =
    usePushNotificationContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className='DropdownMenuContent w-56'
        align='end'
        forceMount
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {profile?.name || 'Anonymous'}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {profile?.email || 'No email'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ProgressBarLink href='/settings'>
            <DropdownMenuItem>
              Profile <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </ProgressBarLink>
          <ProgressBarLink href='/settings/account'>
            <DropdownMenuItem>
              Account Settings <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
            </DropdownMenuItem>
          </ProgressBarLink>
          <ProgressBarLink href='/settings/account'>
            <DropdownMenuItem>
              Settings <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </ProgressBarLink>
          <InstallPWA open={open} onOpenChange={setOpen}>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpen((prev) => !prev);
              }}
            >
              Install Web App
              <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
            </DropdownMenuItem>
          </InstallPWA>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await onClickUnsubscribeToPushNotification().catch(console.error);
            await signOut();
            // custom event to notify the session provider to update the session
            customNotifyEvent('SIGNED_OUT', null);
            if (pushNotificationSupported && navigator?.setAppBadge) {
              navigator.setAppBadge(0);
            }
          }}
          className='text-destructive'
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
