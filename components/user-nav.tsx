'use client';

import { useState } from 'react';

import { signOut } from '@/app/(auth)/actions';
import { InstallPWA } from '@/components/install-pwa';
import { ProgressBarLink } from '@/components/progress-bar';
import { customNotifyEvent } from '@/components/session-provider';
import { useSession } from '@/components/session-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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

export function UserNav() {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const { data: profile } = useProfiles();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-9 w-9 rounded-full'>
          <Avatar className='relative h-9 w-9 rounded-full'>
            <AvatarImage
              src={profile?.avatar_url || ''}
              alt={`${profile?.name} avtar image`}
            />
            <AvatarFallback>O</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='DropdownMenuContent w-56'
        align='end'
        forceMount
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {profile?.name || session?.user.user_metadata.name || 'Anonymous'}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {session?.user.email || 'No email'}
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
            await signOut();
            // custom event to notify the session provider to update the session
            customNotifyEvent('SIGNED_OUT', null);
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
