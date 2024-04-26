'use client';

import { PopoverClose } from '@radix-ui/react-popover';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import * as React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { toast } from 'sonner';

import { Icons } from '@/components/icons';
import { NotificationsButton } from '@/components/notifications-button';
import { useUser } from '@/components/session-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollBar } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useNotifications } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';
import { isDemoUser } from '@/utils/helper';

export function NotificationsPopover() {
  const [scrollParent, setScrollParent] = React.useState<HTMLDivElement | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const user = useUser();
  const { data: notifications, unreadCount, mutate } = useNotifications();

  async function handleDelete(id: number) {
    setLoading(true);

    if (!user || isDemoUser(user.id)) {
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/profiles/${user.id}/notifications`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      if (notifications && mutate) {
        await mutate();

        if (navigator.setAppBadge) {
          navigator.setAppBadge(unreadCount ?? 0);
        }
      }
    }

    setLoading(false);
  }

  async function handleMarkAsRead(id: number) {
    setLoading(true);

    if (!user || isDemoUser(user.id)) {
      setLoading(false);
      return;
    }
    const res = await fetch(`/api/profiles/${user.id}/notifications`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, read: true }),
    });

    if (res.ok) {
      if (notifications && mutate) {
        await mutate();

        if (navigator.setAppBadge) {
          navigator.setAppBadge(unreadCount ?? 0);
        }
      }
    }

    setLoading(false);
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='relative h-9 w-9 rounded-full'
          >
            {!!unreadCount && unreadCount > 0 && (
              <span className='absolute right-0 top-0 flex size-2'>
                <span className='absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75' />
                <span className='relative inline-flex size-2 rounded-full bg-primary' />
              </span>
            )}
            <Icons.bell />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='PopoverContent w-96 p-0'
          align='center'
          forceMount
        >
          <div className='grid'>
            <div className='flex items-center justify-between border-b px-4 py-3 align-middle'>
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
            {notifications && notifications.length > 0 ? (
              <ScrollAreaPrimitive.Root className='relative h-[292px] overflow-hidden'>
                <ScrollAreaPrimitive.Viewport
                  className='h-full w-full rounded-[inherit]'
                  ref={setScrollParent}
                >
                  <Virtuoso
                    data={notifications}
                    height={292}
                    itemContent={(_index, item) => {
                      const {
                        id,
                        title,
                        message,
                        created_at,
                        action,
                        is_read,
                      } = item;

                      return (
                        <Card className='group/item rounded-none border-x-0 border-t-0 hover:bg-muted'>
                          <CardContent className='flex flex-row gap-4 py-4'>
                            <div
                              className={cn(
                                'grid grow items-start',
                                !is_read && 'grid-cols-[25px_1fr]',
                                loading && 'pointer-events-none'
                              )}
                              onClick={() => handleMarkAsRead(id)}
                            >
                              {!is_read && (
                                <span className='flex size-2 translate-y-1 rounded-full bg-primary' />
                              )}
                              <div className='space-y-1'>
                                <p className='text-sm font-medium leading-none'>
                                  {title}
                                </p>
                                <CardDescription>{message}</CardDescription>
                                <span className='text-xs text-muted-foreground'>
                                  {formatDistanceToNow(created_at, {
                                    addSuffix: true,
                                  })}
                                </span>
                              </div>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='size-5'
                                  disabled={loading}
                                  onClick={() => handleDelete(id)}
                                >
                                  <Icons.close />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </CardContent>
                          {action === 'swap_requests' ? (
                            <CardFooter className='-mt-12 flex-row justify-end gap-2 pb-4'>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                  toast.info('Not yet implemented')
                                }
                              >
                                Accept
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                  toast.info('Not yet implemented')
                                }
                              >
                                Deny
                              </Button>
                            </CardFooter>
                          ) : null}
                        </Card>
                      );
                    }}
                    customScrollParent={scrollParent ?? undefined}
                  />
                </ScrollAreaPrimitive.Viewport>
                <ScrollBar />
                <ScrollAreaPrimitive.Corner />
              </ScrollAreaPrimitive.Root>
            ) : (
              <div className='my-4 grid place-items-center gap-4 p-4 text-center'>
                <Icons.bell className='h-20 w-20' />
                <p className='text-sm font-semibold leading-7'>
                  You have no notifications
                </p>
                <p className='text-sm text-muted-foreground'>
                  Get notified when you have new swap requests, duties, or when
                  you have an upcoming duty.
                </p>
                <NotificationsButton />
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
