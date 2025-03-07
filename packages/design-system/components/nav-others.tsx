'use client';

import type { Icon } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

import { cn } from '../lib/utils';
import { ProgressBarLink } from './progress-bar';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';

interface NavOthersProps {
  label: string;
  others: {
    name: string;
    url: string;
    icon?: Icon;
    blank?: boolean;
  }[];
  prefetch?: boolean;
}

export function NavOthers({ label, others, prefetch = false }: NavOthersProps) {
  const pathName = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="underline decoration-wavy underline-offset-4">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu>
        {others.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              className={cn({
                'text-primary hover:text-primary': item.url === pathName,
              })}
            >
              {item.blank ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </a>
              ) : (
                <ProgressBarLink href={item.url} prefetch={prefetch}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </ProgressBarLink>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
