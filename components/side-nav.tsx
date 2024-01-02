'use client';

import {
  GanttChartSquare,
  Home,
  LineChart,
  type LucideIcon,
  Receipt,
  Table,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { APP_NAME } from '@/app/../site.config';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/utils/cn';

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  href?: string;
  icon?: LucideIcon;
  items?: SidebarNavItem[];
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
}

interface MobileSidebarProps extends SidebarProps {
  open: boolean;
  onOpenChange: (flag: boolean) => void;
}

export const sideNavLinks: SidebarNavItem[] = [
  {
    title: 'Admin',
    items: [
      {
        title: 'Manage Users',
        href: '/admin/manage-users',
        icon: Home,
      },
      {
        title: 'Generate Duty',
        href: '/admin/generate-duty',
        icon: GanttChartSquare,
      },
    ],
  },
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Home',
        href: '/',
        icon: Home,
      },
      {
        title: 'Duty Roster',
        href: '/duty-roster',
        icon: GanttChartSquare,
      },
      {
        title: 'My Availability',
        href: '/manage-blockouts',
        icon: Table,
      },
      {
        title: 'Swap Duties',
        href: '/swap-duties',
        icon: LineChart,
      },
      {
        title: 'Duty Personnels',
        href: '/duty-personnels',
        icon: Receipt,
      },
    ],
  },
  {
    title: 'Collections',
    items: [
      {
        title: '✨ IPPT',
        href: '/collections/ippt',
      },
      {
        title: '💰 Pay Day',
        href: '/collections/pay-day',
      },
      {
        title: '📅 ORD',
        href: '/collections/ord',
      },
    ],
  },
  {
    title: 'Others',
    items: [
      {
        title: 'Privacy',
        href: '/privacy',
        icon: Home,
      },
      {
        title: 'Terms and Conditions',
        href: '/terms-and-conditions',
        icon: GanttChartSquare,
      },
      {
        title: 'FAQ',
        href: '/faq',
        icon: Table,
      },
    ],
  },
];

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='left' className='p-0 w-[240px]'>
        <SideNav onClick={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}

export function SideNav({ className, onClick }: SidebarProps) {
  const pathName = usePathname();

  return (
    <div className={cn('flex h-full w-[240px] flex-col', className)}>
      <div className='flex h-16 w-full items-center px-4 justify-start gap-1 border-b text-lg font-medium'>
        <Icons.logo className='h-12 w-12' />
        {APP_NAME || 'APP NAME'}
      </div>
      <div className='py-4'>
        {sideNavLinks.map((item, index) => (
          <div key={index} className='px-3 py-2'>
            <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>
              {item.title}
            </h2>
            {item.items ? (
              <SidebarItems
                pathName={pathName}
                onClick={onClick}
                items={item.items}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarItems({
  items,
  pathName,
  onClick,
}: {
  onClick?: () => void;

  items: SidebarNavItem[];
  pathName: string | null;
}) {
  return items.length
    ? items.map((item, index) => (
        <Button
          key={index}
          asChild
          onClick={onClick}
          variant={item.href === pathName ? 'secondary' : 'ghost'}
          className={cn('mb-1 w-full justify-start', {
            'text-primary': item.href === pathName,
          })}
        >
          {!item.disabled && item.href ? (
            <Link href={item.href}>
              {item.icon && <span className='mr-2'>{<item.icon />}</span>}
              {item.title}
            </Link>
          ) : (
            <span className='flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60'>
              {item.title}
            </span>
          )}
        </Button>
      ))
    : null;
}
