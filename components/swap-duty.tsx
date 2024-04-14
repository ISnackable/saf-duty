'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import * as React from 'react';

import { Icons } from '@/components/icons';
import { LoadingButton } from '@/components/loading-button';
import { useUser } from '@/components/session-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useSwapRequests } from '@/hooks/use-swap-requests';
import { SwapRequests } from '@/lib/supabase/queries';

// function to get all the swap requests that the user has received, and all the swap requests that the user has sent from the swapRecords
function sortSwapRequests(swapRequests?: SwapRequests[], userId?: string) {
  const received = [];
  const sentByMe = [];

  if (swapRequests && swapRequests?.length > 0 && userId) {
    for (const request of swapRequests) {
      if (request.requester?.id === userId) {
        sentByMe.push(request);
      } else if (request.receiver?.id === userId) {
        received.push(request);
      }
    }
  }

  return { received, sentByMe };
}

export function SwapDuty() {
  const user = useUser();
  const { data: swapRequests, mutate } = useSwapRequests();
  const { received, sentByMe } = sortSwapRequests(swapRequests, user?.id);

  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState('receive');
  const [currentSwapRequest, setCurrentSwapRequest] =
    React.useState<SwapRequests | null>(null);

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='receive'>Offers received</TabsTrigger>
          <TabsTrigger value='sent'>Sent by me</TabsTrigger>
        </TabsList>
        <TabsContent value='receive' className='space-y-3'>
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
            Swaps Offers
          </h3>
          {received.length > 0 ? (
            received.map((request) => (
              <Card
                key={request.id}
                className='cursor-pointer'
                onClick={() => {
                  setOpen(true);
                  setCurrentSwapRequest(request);
                }}
              >
                <CardContent className='grid grid-flow-col justify-stretch py-4'>
                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-row'>
                      <Avatar className='size-10'>
                        <AvatarImage
                          className='rounded-xl'
                          src={request.requester.avatar_url || ''}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className='ml-4 flex items-center justify-center align-middle text-lg'>
                        {request.requester.name}
                      </span>
                    </div>
                    <div className='flex flex-row'>
                      <Icons.calendar className='size-4' />
                      <span className='ml-2 flex items-center justify-center align-middle text-xs text-muted-foreground'>
                        {format(
                          new Date(request.requester_roster.duty_date),
                          'eee, PP'
                        )}
                      </span>
                    </div>
                    <div className='flex flex-row'>
                      <Icons.clock className='size-4' />
                      <span className='ml-2 flex items-center justify-center align-middle text-xs text-muted-foreground'>
                        8:00 AM
                      </span>
                    </div>
                  </div>

                  <Icons.arrowBadgeLeft
                    stroke={0.5}
                    className='size-20 justify-self-center'
                  />

                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-row'>
                      <Avatar className='size-10'>
                        <AvatarImage
                          className='rounded-xl'
                          src={request.receiver.avatar_url || ''}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className='ml-4 flex items-center justify-center align-middle text-lg'>
                        {request.receiver.name}
                      </span>
                    </div>
                    <div className='flex flex-row'>
                      <Icons.calendar className='size-4' />
                      <span className='ml-2 flex items-center justify-center align-middle text-xs text-muted-foreground'>
                        {format(
                          new Date(request.receiver_roster.duty_date),
                          'eee, PP'
                        )}
                      </span>
                    </div>
                    <div className='flex flex-row'>
                      <Icons.clock className='size-4' />
                      <span className='ml-2 flex items-center justify-center align-middle text-xs text-muted-foreground'>
                        8:00 AM
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No requests to display</p>
          )}
        </TabsContent>
        <TabsContent value='sent' className='space-y-3'>
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
            Pending Approval
          </h3>
          {sentByMe.length > 0 ? (
            sentByMe.map((request) => (
              <Card
                key={request.id}
                className='cursor-pointer'
                onClick={() => {
                  setOpen(true);
                  setCurrentSwapRequest(request);
                }}
              >
                <CardContent className='grid grid-flow-col justify-stretch py-4'>
                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-row'>
                      <Avatar className='size-10'>
                        <AvatarImage
                          className='rounded-xl'
                          src={request.requester.avatar_url || ''}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className='ml-4 flex items-center justify-center align-middle text-lg'>
                        {request.requester.name}
                      </span>
                    </div>
                    <div className='flex flex-row'>
                      <Icons.calendar className='size-4' />
                      <span className='ml-2 flex items-center justify-center align-middle text-xs text-muted-foreground'>
                        {format(
                          new Date(request.requester_roster.duty_date),
                          'eee, PP'
                        )}
                      </span>
                    </div>
                    <div className='flex flex-row'>
                      <Icons.clock className='size-4' />
                      <span className='ml-2 flex items-center justify-center align-middle text-xs text-muted-foreground'>
                        8:00 AM
                      </span>
                    </div>
                  </div>

                  <Icons.arrowBadgeRight
                    stroke={0.5}
                    className='size-20 justify-self-center'
                  />

                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-row'>
                      <Avatar className='size-10'>
                        <AvatarImage
                          className='rounded-xl'
                          src={request.receiver.avatar_url || ''}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className='ml-4 flex items-center justify-center align-middle text-lg'>
                        {request.receiver.name}
                      </span>
                    </div>
                    <div className='flex flex-row'>
                      <Icons.calendar className='size-4' />
                      <span className='ml-2 flex items-center justify-center align-middle text-xs text-muted-foreground'>
                        {format(
                          new Date(request.receiver_roster.duty_date),
                          'eee, PP'
                        )}
                      </span>
                    </div>
                    <div className='flex flex-row'>
                      <Icons.clock className='size-4' />
                      <span className='ml-2 flex items-center justify-center align-middle text-xs text-muted-foreground'>
                        8:00 AM
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>
              No requests to display, you can request to swap duties{' '}
              <Link
                className='font-medium text-primary underline underline-offset-4'
                href='/duty-roster'
              >
                here
              </Link>
              !
            </p>
          )}
        </TabsContent>
      </Tabs>

      <CredenzaContent className='min-w-[300px] md:min-w-[750px]'>
        <CredenzaHeader>
          <CredenzaTitle>Swap Details</CredenzaTitle>
          <CredenzaDescription>
            Swap details are shown below
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody className='space-y-3'>
          {currentSwapRequest && (
            <>
              <div className='grid grid-cols-2 gap-4'>
                <Card>
                  <CardHeader className='items-center justify-center text-center'>
                    <Avatar className='size-16'>
                      <AvatarImage
                        src={currentSwapRequest.requester.avatar_url || ''}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <CardTitle>
                      {currentSwapRequest.requester.name}{' '}
                      {user?.id === currentSwapRequest.requester.id && '(you)'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm'>
                      Date:{' '}
                      <span className='text-muted-foreground'>
                        {format(
                          new Date(
                            currentSwapRequest.requester_roster.duty_date
                          ),
                          'PPPP'
                        )}
                      </span>
                    </p>
                    <p className='text-sm'>
                      Time:{' '}
                      <span className='text-muted-foreground'>8:00AM</span>
                    </p>
                  </CardContent>
                </Card>

                <Button
                  variant='outline'
                  size='icon'
                  className='absolute bottom-[52%] left-[calc(50%-25px)] size-12 cursor-default rounded-full hover:bg-background'
                >
                  <Icons.arrowExchange className='size-8' />
                </Button>

                <Card>
                  <CardHeader className='items-center justify-center text-center'>
                    <Avatar className='size-16'>
                      <AvatarImage
                        src={currentSwapRequest.receiver.avatar_url || ''}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <CardTitle>
                      {currentSwapRequest.receiver.name}{' '}
                      {user?.id === currentSwapRequest.receiver.id && '(you)'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm'>
                      Date:{' '}
                      <span className='text-muted-foreground'>
                        {format(
                          new Date(
                            currentSwapRequest.receiver_roster.duty_date
                          ),
                          'PPPP'
                        )}
                      </span>
                    </p>
                    <p className='text-sm'>
                      Time:{' '}
                      <span className='text-muted-foreground'>8:00AM</span>
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='email'>Reason</Label>
                <Textarea
                  readOnly
                  className='cursor-default resize-none'
                  value={currentSwapRequest?.reason || 'No reason provided'}
                />
              </div>
            </>
          )}
        </CredenzaBody>

        <CredenzaFooter className='flex-row'>
          {tabValue === 'receive' ? (
            <>
              <LoadingButton
                className='w-full md:w-24'
                variant='destructive'
                type='submit'
                loading={loading}
              >
                Deny
              </LoadingButton>
              <LoadingButton
                className='w-full bg-emerald-600 text-white hover:bg-emerald-600/90 md:w-24'
                type='submit'
                loading={loading}
              >
                Approve
              </LoadingButton>
            </>
          ) : (
            <LoadingButton
              className='w-full md:w-36'
              variant='secondary'
              type='submit'
              loading={loading}
            >
              Cancel Request
            </LoadingButton>
          )}
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
