import type { Icon } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

import { ProgressBarLink } from '@/components/progress-bar';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function NavOthers({
  label,
  others,
}: {
  label: string;
  others: {
    name: string;
    url: string;
    icon?: Icon;
  }[];
}) {
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
              <ProgressBarLink href={item.url} prefetch={false}>
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.name}</span>
              </ProgressBarLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
