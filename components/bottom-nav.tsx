'use client';

import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { Icons } from '@/components/icons';
import { ProgressBarLink } from '@/components/progress-bar';
import { cn } from '@/lib/utils';

const routes = [
  { link: '/', label: 'Home', icon: Icons.homeFilled },
  {
    link: '/duty-roster',
    label: 'Duty Roster',
    icon: Icons.calendarEventFilled,
  },
  {
    link: '/manage-blockouts',
    label: 'My Availability',
    icon: Icons.editFilled,
  },
  { link: '/swap-duties', label: 'Swap Duties', icon: Icons.arrowExchange },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div
      data-tour='bottom-nav'
      style={{
        paddingBottom:
          'clamp(0px, calc(env(safe-area-inset-bottom, 0px)), 20px)',
        height: 'clamp(60px, calc(env(safe-area-inset-bottom) + 60px), 80px)',
        maxHeight:
          'clamp(60px, calc(env(safe-area-inset-bottom) + 60px), 80px)',
      }}
      className='fixed bottom-0 z-30 h-[60px] w-full border-t border-border bg-card shadow-lg sm:hidden dark:border-zinc-800 dark:bg-[#141517]'
    >
      <div
        className={cn('flex h-full flex-row items-center justify-start gap-4')}
      >
        {routes.map((item) => (
          <ProgressBarLink
            key={item.label}
            href={item.link}
            prefetch={false}
            style={{
              maxWidth: 'calc(25% - 0.75rem)',
              transformStyle: 'preserve-3d',
            }}
            className={cn('grow')}
          >
            {pathname === item.link && (
              <motion.div
                layoutId='clickedbutton'
                transition={{ type: 'spring', bounce: 0.3, duration: 0.3 }}
                className={cn(
                  'absolute inset-x-0 inset-y-[-8.5px] border-t border-primary'
                )}
              />
            )}

            <div
              className={cn('flex flex-col items-center justify-center', {
                'text-primary': pathname === item.link,
              })}
            >
              <item.icon className='mb-1 h-6 w-6 group-hover:text-blue-600 dark:group-hover:text-blue-500' />
              <div className='text-center text-xs group-hover:text-blue-600 dark:group-hover:text-blue-500'>
                {item.label}
              </div>
            </div>
          </ProgressBarLink>
        ))}
      </div>
    </div>
  );
}
