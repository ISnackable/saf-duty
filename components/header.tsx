'use client';

import { Icons } from '@/components/icons';
import { NotificationsPopover } from '@/components/notifications-popover';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';

export function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <header
      data-tour='header'
      className='sticky top-0 z-50 flex h-16 w-full flex-row items-center border-b bg-popover px-3 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'
    >
      <div className='flex grow basis-0 justify-start'>
        <Button
          data-tour='side-nav-button'
          role='button'
          aria-label='Menu'
          variant='ghost'
          className='xl:hidden'
          size='icon'
          onClick={toggleSidebar}
        >
          <Icons.menu size={30} />
        </Button>
      </div>

      <div>
        <ThemeSwitcher />
      </div>

      <div className='flex grow basis-0 justify-end space-x-2 align-middle'>
        <NotificationsPopover />
        <UserNav />
      </div>
    </header>
  );
}
