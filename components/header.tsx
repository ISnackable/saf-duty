'use client';

import { type Session } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';

import { Icons } from '@/components/icons';
import { MobileSidebar } from '@/components/side-nav';
import { Button } from '@/components/ui/button';
import { Tables } from '@/types/supabase';
import { cn } from '@/utils/cn';

import { ThemeSwitcher } from './theme-switcher';
import { UserNav } from './user-nav';

interface HeaderProps {
  session: Session;
  profile: Pick<Tables<'profiles'>, 'name' | 'avatar_url'>;
}

export function Header({ session, profile }: HeaderProps) {
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
    <>
      <div ref={navRef}></div>
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 flex h-16 w-full items-center border-b bg-popover px-3 xl:w-[calc(100%-240px)]'
        )}
      >
        <div className='mr-0 flex h-14 w-full items-center justify-between sm:mr-2'>
          <Button
            role='button'
            aria-label='Menu'
            variant='ghost'
            className='xl:hidden'
            size='icon'
            onClick={() => setOpen(true)}
          >
            <Icons.menu size={30} />
          </Button>

          <div className='xl:ml-auto'>
            <ThemeSwitcher />
          </div>
          <div className='flex items-center justify-end space-x-2 xl:ml-auto'>
            <UserNav session={session} profile={profile} />
          </div>
        </div>
      </aside>

      <MobileSidebar open={open} onOpenChange={setOpen} session={session} />
    </>
  );
}
