import { type Session } from '@supabase/supabase-js';
import Link from 'next/link';

import { signOut } from '@/app/(auth)/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tables } from '@/types/supabase';

import { Switch } from './ui/switch';

interface UserNavProps {
  session: Session;
  profile: Pick<Tables<'profiles'>, 'name' | 'avatar_url' | 'ord_date'>;
}

export function UserNav({ session, profile }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-9 w-9 rounded-full'>
          <Avatar className='relative h-9 w-9 rounded-full'>
            <AvatarImage
              src={profile.avatar_url || ''}
              alt={`${profile.name} avtar image`}
            />
            <AvatarFallback>O</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='DropdownMenuContent w-56'
        align='end'
        forceMount
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {profile.name || session.user.user_metadata.name || 'Anonymous'}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {session.user.email || 'No email'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/settings'>
              Profile <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/settings/account'>
              Account Settings <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Install Web App
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <div className='flex items-center justify-between'>
              Push Notification <Switch />
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => await signOut()}
          className='text-destructive'
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}