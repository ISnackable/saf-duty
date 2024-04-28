'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Icons } from '@/components/icons';
import { NotificationsPopover } from '@/components/notifications-popover';
import { MobileSidebar } from '@/components/side-nav';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

export function Header() {
  const navRef = useRef(null);
  const [_scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1280px)');
  const pathname = usePathname();

  useEffect(() => {
    if (open && !isDesktop) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
        <div
          className='mr-0 flex h-14 w-full items-center align-middle sm:mr-2'
          data-tour='header'
        >
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

          <div className='flex flex-grow basis-0 justify-end space-x-2 align-middle'>
            <NotificationsPopover />
            <UserNav />
          </div>
        </div>
      </aside>

      <MobileSidebar open={open} onOpenChange={setOpen} />
    </header>
  );
}
