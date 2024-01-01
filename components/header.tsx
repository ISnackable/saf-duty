'use client';

import { Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { MobileSidebar } from '@/components/side-nav';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

import { ThemeSwitcher } from './theme-switcher';

export function Header() {
  const navRef = useRef(null);
  const [scroll, setScroll] = useState(false);
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
          'fixed right-0 top-0 z-50 flex h-16 w-full items-center border-b bg-background px-3 xl:w-[calc(100%-240px)]'
        )}
      >
        <div className='flex h-14 max-w-screen-2xl w-auto items-center'>
          <Button
            role='button'
            aria-label='Menu'
            variant='ghost'
            className='xl:hidden'
            size='icon'
            onClick={() => setOpen(true)}
          >
            <Menu size={30} />
          </Button>

          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitcher />
          </div>
        </div>
      </aside>

      <MobileSidebar open={open} onOpenChange={setOpen} />
    </>
  );
}
