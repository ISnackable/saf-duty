'use client';

import {
  type Icon,
  IconArrowsExchange,
  IconCalendarEvent,
  IconEdit,
  IconHome2,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { cn } from '@/utils/cn';

export interface IconProps extends React.ComponentPropsWithoutRef<'button'> {
  title?: string;
  icon: Icon;
  to: string;
  isActive: boolean;
  key: string;
}

const routes = [
  { link: '/', label: 'Home', icon: IconHome2 },
  { link: '/duty-roster', label: 'Duty Roster', icon: IconCalendarEvent },
  { link: '/manage-blockouts', label: 'My Availability', icon: IconEdit },
  { link: '/swap-duties', label: 'Swap Duties', icon: IconArrowsExchange },
];

function NavIcon({ icon: Icon, to, title, isActive }: IconProps) {
  return (
    <Link
      href={to}
      prefetch={false}
      style={{
        maxWidth: 'calc(25% - 0.75rem)',
      }}
      className='grow'
    >
      <div
        className={cn('flex flex-col items-center justify-start', {
          'text-blue-600': isActive,
        })}
      >
        <Icon
          className={cn(
            'mb-1 w-6 h-6 group-hover:text-blue-600 dark:group-hover:text-blue-500'
          )}
        />
        <div
          className={
            'text-xs group-hover:text-blue-600 dark:group-hover:text-blue-500'
          }
        >
          {title}
        </div>
      </div>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  const links = routes.map((route) => {
    return (
      <NavIcon
        key={route.label}
        icon={route.icon}
        title={route.label}
        to={route.link}
        isActive={pathname === route.link}
      />
    );
  });

  return (
    <footer
      style={{
        paddingBottom:
          'clamp(0px, calc(env(safe-area-inset-bottom, 0px)), 20px)',
        height: 'clamp(60px, calc(env(safe-area-inset-bottom) + 60px), 80px)',
        maxHeight:
          'clamp(60px, calc(env(safe-area-inset-bottom) + 60px), 80px)',
      }}
      className='fixed bottom-0 w-full z-10 bg-zinc-100 dark:bg-zinc-950 border-t dark:border-zinc-800 border-zinc-200 shadow-lg sm:hidden h-[60px]'
    >
      <div className='flex flex-row gap-4 justify-start items-center h-full'>
        {links}
      </div>
    </footer>
  );
}
