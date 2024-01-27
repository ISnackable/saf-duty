import { PopoverClose } from '@radix-ui/react-popover';
import { type Session } from '@supabase/supabase-js';
import Link from 'next/link';

import { Icons } from '@/components/icons';
import { NotificationsButton } from '@/components/notifications-button';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

export function NotificationsPopover({ session }: { session: Session }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='icon' className='h-9 w-9 rounded-full'>
          <Icons.bell />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='PopoverContent w-96' align='center' forceMount>
        <div className='grid gap-4'>
          <div className='flex items-center justify-between align-middle'>
            <h4 className='scroll-m-20 font-semibold leading-none tracking-tight'>
              Notifications
            </h4>
            <PopoverClose asChild>
              <Button variant='ghost' size='icon' asChild>
                <Link href='/settings/notifications'>
                  <Icons.settings />
                </Link>
              </Button>
            </PopoverClose>
          </div>
          <Separator />
          <div className='my-4 grid place-items-center gap-4 text-center'>
            <Icons.bell className='h-20 w-20' />

            <p className='text-sm font-semibold leading-7'>
              You have no notifications
            </p>
            <p className='text-sm text-muted-foreground'>
              Get notified when you have new swap requests, duties, or when you
              have an upcoming duty.
            </p>

            <NotificationsButton session={session} />
          </div>
          {/* <div className='grid gap-2'></div> */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
