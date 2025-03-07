import { CaretSortIcon, PlusIcon } from '@radix-ui/react-icons';
import type { Organization } from '@repo/auth/types';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar';
import { Skeleton } from './ui/skeleton';

interface TeamSwitcherProps {
  teams: Organization[] | null;
  activeTeam: Organization | null;
  setActiveTeam: (team: Organization) => void;
}

export function TeamSwitcher({
  teams,
  activeTeam,
  setActiveTeam,
}: TeamSwitcherProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary-700 bg-opacity-60 text-sidebar-primary-foreground">
                <Avatar className="h-8 w-8 rounded-md">
                  <AvatarImage
                    crossOrigin="anonymous"
                    src={activeTeam?.logo ?? undefined}
                    alt="team logo"
                    className="rounded-md object-cover"
                  />
                  <AvatarFallback>
                    {activeTeam?.name?.slice(0, 2).toUpperCase() ?? 'CN'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam?.name ?? <Skeleton className="h-4 w-[10px]" />}
                </span>
                {activeTeam?.metadata && (
                  <span className="truncate text-xs">
                    {activeTeam?.metadata}
                  </span>
                )}
              </div>
              <CaretSortIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {teams?.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Avatar className="h-6 w-6 rounded-md">
                    <AvatarImage
                      crossOrigin="anonymous"
                      src={team?.logo ?? undefined}
                      alt="team logo"
                      className="rounded-md object-cover"
                    />
                    <AvatarFallback>
                      {team?.name?.slice(0, 2).toUpperCase() ?? 'CN'}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <PlusIcon className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
