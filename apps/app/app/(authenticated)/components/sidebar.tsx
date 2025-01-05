'use client';

import type * as React from 'react';

import {
  organization,
  useActiveOrganization,
  useListOrganizations,
  useSession,
} from '@repo/auth/client';
import { isDemoUser } from '@repo/auth/lib/utils';
import type { Organization } from '@repo/auth/types';
import { Icons } from '@repo/design-system/components/icons';
import { NavCollapsible } from '@repo/design-system/components/nav-collapsible';
import { NavOthers } from '@repo/design-system/components/nav-others';
import { NavUser } from '@repo/design-system/components/nav-user';
import { TeamSwitcher } from '@repo/design-system/components/team-switcher';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@repo/design-system/components/ui/sidebar';
import { SidebarMenuButton } from '@repo/design-system/components/ui/sidebar';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';

const data = {
  organization: [
    {
      title: 'Duty Panel',
      url: '#',
      icon: Icons.layersIntersect,
      isActive: false,
      items: [
        {
          title: 'Schedule Duty',
          url: '/organization/schedule-duty',
          icon: Icons.chessKnight,
        },
      ],
    },
    {
      title: 'Admin Panel',
      url: '#',
      icon: Icons.fingerprint,
      isActive: false,
      items: [
        {
          title: 'Manage Personnel',
          url: '/organization/manage-personnel',
          icon: Icons.user,
        },
        {
          title: 'Manage Invites',
          url: '/organization/manage-invites',
          icon: Icons.mailForward,
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
  const { data: session } = useSession();
  const { data: organizations } = useListOrganizations();
  const { data: activeOrganization } = useActiveOrganization();
  const profile = session?.user;

  async function setActiveOrganization(team: Organization) {
    await organization.setActive({
      organizationId: team.id,
    });
  }

  return (
    <Sidebar collapsible="offcanvas" className="h-full" {...props}>
      <SidebarHeader className="h-16 border-b">
        <TeamSwitcher
          teams={organizations}
          activeTeam={activeOrganization}
          setActiveTeam={setActiveOrganization}
        />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea>
          {session &&
          session.user.role !== 'admin' &&
          !isDemoUser(session.user?.id) ? null : (
            <NavCollapsible label="Organisation" items={data.organization} />
          )}
          <NavOthers label="Dashboard" others={data.dashboard} />
          <NavOthers label="Collections" others={data.collections} />
          <NavOthers label="Others" others={data.others} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NavUser name={profile?.name} email={profile?.email}>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                crossOrigin="anonymous"
                src={profile?.image ?? undefined}
                alt={`${profile?.name} avatar image`}
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            {profile ? (
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{profile.name}</span>
                <span className="truncate text-xs">{profile.email}</span>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-3 w-6/12" />
                <Skeleton className="h-3 w-36" />
              </div>
            )}
            <Icons.chevronUp className="ml-auto size-4" />
          </SidebarMenuButton>
        </NavUser>
      </SidebarFooter>
    </Sidebar>
  );
}
