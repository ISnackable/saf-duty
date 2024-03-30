'use client';

import { useEffect, useRef, useState } from 'react';

import { Icons } from '@/components/icons';
import { NotificationsPopover } from '@/components/notifications-popover';
import { MobileSidebar } from '@/components/side-nav';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import { cn } from '@/utils/cn';

export function Header() {
  const navRef = useRef(null);
  const [_scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        setScroll(!entries[0].isIntersecting);
      },
      {
        root: null,
        rootMargin: `10px 0px`,
        threshold: 0,
      }
    );

    intersectionObserver.observe(navRef.current!);

    return () => intersectionObserver.disconnect();
  }, []);

  return (
    <header>
      <div ref={navRef}></div>
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 flex h-16 w-full items-center border-b bg-popover px-3 xl:w-[calc(100%-240px)]'
        )}
      >
        <div className='mr-0 flex h-14 w-full items-center align-middle sm:mr-2'>
          <div className='flex flex-grow basis-0 justify-start'>
            <Button
              data-tour='side-nav-button'
              role='button'
              aria-label='Menu'
              variant='ghost'
              className='xl:hidden'
              size='icon'
              onClick={() => setOpen(true)}
            >
              <Icons.menu size={30} />
            </Button>
          </div>

          <div>
            <ThemeSwitcher />
          </div>

          <div
            className='flex flex-grow basis-0 justify-end space-x-2 align-middle'
            data-tour='header'
          >
            <NotificationsPopover />
            <UserNav />
          </div>
        </div>
      </aside>

      <MobileSidebar open={open} onOpenChange={setOpen} />
    </header>
  );
}
