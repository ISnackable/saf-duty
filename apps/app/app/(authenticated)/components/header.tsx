'use client';

import { useSession } from '@repo/auth/client';
import { Icons } from '@repo/design-system/components/icons';
import { NavUser } from '@repo/design-system/components/nav-user';
// import { NotificationsPopover } from '@repo/design-system/components/notifications-popover';
import { ThemeSwitcher } from '@repo/design-system/components/theme-switcher';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import { Button } from '@repo/design-system/components/ui/button';
import { useSidebar } from '@repo/design-system/components/ui/sidebar';

export function Header() {
  const { toggleSidebar } = useSidebar();
  const { data: session } = useSession();
  const profile = session?.user;

  return (
    <header
      data-tour="header"
      className="sticky top-0 z-50 flex h-16 w-full flex-row items-center border-b bg-popover px-3 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
    >
      <div className="flex grow basis-0 justify-start">
        <Button
          data-tour="side-nav-button"
          type="button"
          aria-label="Menu"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <Icons.menu size={30} />
        </Button>
      </div>

      <div>
        <ThemeSwitcher />
      </div>

      <div className="flex grow basis-0 justify-end space-x-2 align-middle">
        {/* <NotificationsPopover /> */}
        <NavUser name={profile?.name ?? 'User'} email={profile?.email ?? ''}>
          <Button variant="ghost" className="relative rounded-full p-0">
            <Avatar className="relative size-9 rounded-full">
              <AvatarImage
                crossOrigin="anonymous"
                src={profile?.image ?? undefined}
                alt={`${profile?.name} avatar image`}
                className="object-cover"
              />
              <AvatarFallback>O</AvatarFallback>
            </Avatar>
          </Button>
        </NavUser>
      </div>
    </header>
  );
}
