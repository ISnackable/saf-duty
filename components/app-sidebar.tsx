'use client';

import * as React from 'react';

import { Icons } from '@/components/icons';
import { NavCollapsible } from '@/components/nav-collapsible';
import { NavOthers } from '@/components/nav-others';
import { NavUser } from '@/components/nav-user';
import { useSession } from '@/components/session-provider';
import { TeamSwitcher } from '@/components/team-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfiles } from '@/hooks/use-profiles';
import { isDemoUser } from '@/utils/helper';

const data = {
  admin: [
    {
      title: 'Admin Panel',
      url: '#',
      icon: Icons.fingerprint,
      isActive: false,
      items: [
        {
          title: 'Manage Personnel',
          url: '/admin/manage-personnel',
          icon: Icons.user,
        },
        {
          title: 'Schedule Duty',
          url: '/admin/schedule-duty',
          icon: Icons.chessKnight,
        },
      ],
    },
  ],
  dashboard: [
    {
      name: 'Home',
      url: '/',
      icon: Icons.home,
    },
    {
      name: 'Duty Roster',
      url: '/duty-roster',
      icon: Icons.calendarEvent,
    },
    {
      name: 'My Availability',
      url: '/manage-blockouts',
      icon: Icons.edit,
    },
    {
      name: 'Swap Duties',
      url: '/swap-duties',
      icon: Icons.arrowExchange,
    },
    {
      name: 'Duty Personnels',
      url: '/duty-personnels',
      icon: Icons.users,
    },
  ],
  collections: [
    {
      name: '✨ IPPT',
      url: '/collections/ippt',
    },
    {
      name: '💰 Pay Day',
      url: '/collections/pay-day',
    },
    {
      name: '📅 ORD',
      url: '/collections/ord',
    },
  ],
  others: [
    {
      name: 'Settings',
      url: '/settings/account',
      icon: Icons.settings,
    },
    {
      name: 'Privacy',
      url: '/privacy',
      icon: Icons.cloudLock,
    },
    {
      name: 'Terms and Conditions',
      url: '/terms',
      icon: Icons.ce,
    },
    {
      name: 'FAQ',
      url: '/faq',
      icon: Icons.messageCircleQuestion,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  const { data: profile } = useProfiles();

  const teams = [
    {
      name: 'Work In Progress',
      logo: Icons.logo,
      role: session?.user.app_metadata?.groups?.role || 'user',
    },
  ];

  return (
    <Sidebar collapsible='offcanvas' className='h-full' {...props}>
      <SidebarHeader className='h-16 border-b'>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea>
          {session &&
          session.user.app_metadata?.groups?.role !== 'admin' &&
          !isDemoUser(session.user?.id) ? null : (
            <NavCollapsible label='Admin' items={data.admin} />
          )}
          <NavOthers label='Dashboard' others={data.dashboard} />
          <NavOthers label='Collections' others={data.collections} />
          <NavOthers label='Others' others={data.others} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className='border-t'>
        <NavUser>
          <SidebarMenuButton
            size='lg'
            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          >
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage
                src={profile?.avatar_url || undefined}
                alt={`${profile?.name} avtar image`}
              />
              <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
            </Avatar>
            {!profile ? (
              <div className='flex flex-col space-y-2'>
                <Skeleton className='h-3 w-6/12' />
                <Skeleton className='h-3 w-36' />
              </div>
            ) : (
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{profile.name}</span>
                <span className='truncate text-xs'>{profile.email}</span>
              </div>
            )}
            <Icons.chevronUp className='ml-auto size-4' />
          </SidebarMenuButton>
        </NavUser>
      </SidebarFooter>
    </Sidebar>
  );
}
