'use client';

import { ChevronRightIcon } from '@radix-ui/react-icons';
import type { Icon } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

import { ProgressBarLink } from '@/components/progress-bar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function NavCollapsible({
  label,
  items,
}: {
  label: string;
  items: {
    title: string;
    url: string;
    icon?: Icon;
    isActive?: boolean;
    items?: {
      title: string;
      icon?: Icon;
      url: string;
    }[];
  }[];
}) {
  const pathName = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className='underline decoration-wavy underline-offset-4'>
        {label}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className='group/collapsible'
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRightIcon className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className='CollapsibleContent'>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        className={cn('stroke-current', {
                          'stroke-primary text-primary hover:stroke-primary hover:text-primary':
                            subItem.url === pathName,
                        })}
                      >
                        <ProgressBarLink href={subItem.url} prefetch={false}>
                          {subItem.icon && (
                            <subItem.icon className='h-4 w-4 stroke-inherit' />
                          )}
                          <span>{subItem.title}</span>
                        </ProgressBarLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
