'use client';

import { type Session } from '@supabase/supabase-js';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button, buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/utils/cn';

export type SidebarNavItem = {
  title?: string;
  admin?: boolean;
  disabled?: boolean;
  href?: string;
  icon?: LucideIcon;
  items?: SidebarNavItem[];
  collapsible?: boolean;
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
  session: Session;
}

interface MobileSidebarProps extends SidebarProps {
  open: boolean;
  onOpenChange: (flag: boolean) => void;
}

export const sideNavLinks: SidebarNavItem[] = [
  {
    admin: true,
    title: 'Admin',
    items: [
      {
        title: 'Admin Panel',
        collapsible: true,
        icon: Home,
        items: [
          {
            title: 'Manage Personnel',
            href: '/admin/manage-personnel',
            icon: Home,
          },
          {
            title: 'Schedule Duty',
            href: '/admin/schedule-duty',
            icon: GanttChartSquare,
          },
        ],
      },
    ],
  },
  {
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

export function MobileSidebar({
  open,
  onOpenChange,
  session,
}: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='left'
        className='p-0 sm:w-[240px] bg-popover'
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SideNav onClick={() => onOpenChange(false)} session={session} />
      </SheetContent>
    </Sheet>
  );
}

export function SideNav({ className, onClick, session }: SidebarProps) {
  const pathName = usePathname();

  return (
    <div
      className={cn('flex h-full sm:w-[240px] flex-col bg-popover', className)}
    >
      <div className='flex h-16 w-full items-center px-4 justify-start gap-1 border-b text-lg font-medium'>
        <Icons.logo className='h-12 w-12' />
        {APP_NAME || 'APP NAME'}
      </div>
      <ScrollArea className='py-2'>
        {sideNavLinks.map((item, index) => {
          if (item.admin && session.user.app_metadata.role !== 'admin') {
            return null;
          }
          return (
            <div key={index} className='px-[6px] py-2 border-b-[1px]'>
              {item.title && (
                <h2 className='mb-1 px-4 text-sm font-semibold tracking-tight underline underline-offset-4 decoration-wavy'>
                  {item.title}
                </h2>
              )}

              {item.items ? (
                <SidebarItems
                  pathName={pathName}
                  onClick={onClick}
                  items={item.items}
                />
              ) : null}
            </div>
          );
        })}
      </ScrollArea>
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
  return items.map((item, index) => {
    return item.collapsible && item.title ? (
      <Accordion key={index} type='single' collapsible className='space-y-2'>
        <AccordionItem value={item.title} className='border-none'>
          <AccordionTrigger
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-full justify-start text-sm font-medium px-[10px] py-2 duration-200 hover:no-underline',
              {
                'text-primary': item.href === pathName,
              }
            )}
          >
            {item.icon && (
              <span className='mr-2'>{<item.icon className='w-4 h-4' />}</span>
            )}
            {item.title}
          </AccordionTrigger>
          <AccordionContent className='ml-4 pb-0'>
            {item.items ? (
              <SidebarItems
                pathName={pathName}
                onClick={onClick}
                items={item.items}
              />
            ) : null}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ) : (
      <Button
        key={index}
        asChild
        onClick={onClick}
        variant='ghost'
        className={cn(
          'w-full justify-start text-sm font-medium px-[10px] py-2',
          {
            'text-primary': item.href === pathName,
          }
        )}
      >
        {!item.disabled && item.href ? (
          <Link href={item.href}>
            {item.icon && (
              <span className='mr-2'>{<item.icon className='w-4 h-4' />}</span>
            )}
            {item.title}
          </Link>
        ) : (
          <span className='flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60'>
            {item.title}
          </span>
        )}
      </Button>
    );
  });
}
