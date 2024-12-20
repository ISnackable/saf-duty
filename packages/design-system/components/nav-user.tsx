'use client';

import * as React from 'react';

import { Icons } from '@/components/icons';
import { InstallPWA } from '@/components/install-pwa';
import { ProgressBarLink } from '@/components/progress-bar';
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
import { signOut } from '@repo/auth/client';
import { redirect } from 'next/navigation';

export function NavUser({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  //   const { data: profile } = useProfiles();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="DropdownMenuContent w-56"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">{'Anonymous'}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {'No email'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ProgressBarLink href="/settings">
            <DropdownMenuItem>
              Profile <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </ProgressBarLink>
          <ProgressBarLink href="/settings/account">
            <DropdownMenuItem>
              Account Settings <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
            </DropdownMenuItem>
          </ProgressBarLink>
          <ProgressBarLink href="/settings/account">
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
            await signOut({
              fetchOptions: {
                onSuccess: () => {
                  redirect('/sign-in');
                },
              },
            });
          }}
          className="text-destructive"
        >
          <Icons.logOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
