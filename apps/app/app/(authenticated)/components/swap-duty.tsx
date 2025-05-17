// 'use client';

// import { format } from 'date-fns';
// import Link from 'next/link';
// import * as React from 'react';
// import type { DayContentProps } from 'react-day-picker';
// import { toast } from 'sonner';

// import { useSwapRequests } from '@/hooks/use-swap-requests';
// import type { SwapRequests } from '@/lib/types';
// import { useSession } from '@repo/auth/client';
// import { Icons } from '@repo/design-system/components/icons';
// import { LoadingButton } from '@repo/design-system/components/loading-button';
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from '@repo/design-system/components/ui/avatar';
// import { Button } from '@repo/design-system/components/ui/button';
// import { Calendar } from '@repo/design-system/components/ui/calendar';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '@repo/design-system/components/ui/card';
// import {
//   Credenza,
//   CredenzaBody,
//   CredenzaContent,
//   CredenzaFooter,
//   CredenzaHeader,
//   CredenzaTitle,
// } from '@repo/design-system/components/ui/credenza';
// import { Label } from '@repo/design-system/components/ui/label';
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from '@repo/design-system/components/ui/tabs';
// import { Textarea } from '@repo/design-system/components/ui/textarea';

// function DateTime(props: DayContentProps) {
//   const dateTime = format(props.date, 'yyyy-MM-dd');
//   const isRequests =
//     props.activeModifiers?.receiverRoster ||
//     props.activeModifiers?.requesterRoster;

//   return (
//     <time dateTime={dateTime}>
//       {isRequests ? (
//         <ArcherElement
//           id={
//             props.activeModifiers.receiverRoster
//               ? 'requesterRoster'
//               : 'receiverRoster'
//           }
//           relations={[
//             {
//               targetId: props.activeModifiers.receiverRoster
//                 ? 'receiverRoster'
//                 : '',
//               targetAnchor: 'top',
//               sourceAnchor: 'bottom',
//               style: { strokeWidth: 1 },
//             },
//           ]}
//         >
//           <div>
//             <DayContent {...props} />
//           </div>
//         </ArcherElement>
//       ) : (
//         <DayContent {...props} />
//       )}
//     </time>
//   );
// }

// // function to get all the swap requests that the user has received, and all the swap requests that the user has sent from the swapRecords
// function sortSwapRequests(swapRequests?: SwapRequests[], userId?: string) {
//   const received: SwapRequests[] = [];
//   const sentByMe: SwapRequests[] = [];

//   if (swapRequests && swapRequests?.length > 0 && userId) {
//     for (const request of swapRequests) {
//       if (request.profile_requesterId?.user?.id === userId) {
//         sentByMe.push(request);
//       } else if (request.profile_receiverId?.user?.id === userId) {
//         received.push(request);
//       }
//     }
//   }

//   return { received, sentByMe };
// }

// export function SwapDuty() {
//   const { data: session } = useSession();
//   const { data: swapRequests, mutate } = useSwapRequests();
//   const { received, sentByMe } = sortSwapRequests(
//     swapRequests,
//     session?.user.id
//   );

//   const [loading, setLoading] = React.useState(false);
//   const [open, setOpen] = React.useState(false);
//   const [tabValue, setTabValue] = React.useState('receive');
//   const [currentSwapRequest, setCurrentSwapRequest] =
//     React.useState<SwapRequests | null>(null);

//   async function handleSwapRequest(
//     e: React.MouseEvent<HTMLButtonElement, MouseEvent>
//   ) {
//     const action = e.currentTarget.innerText.toLowerCase();
//     if (!currentSwapRequest || !action || !session) {
//       return;
//     }

//     setLoading(true);
//     const toastId = toast.loading('Loading...');

//     try {
//       const res = await fetch(
//         `/api/profiles/${session.user.id}/swap-requests`,
//         {
//           method: action === 'approve' ? 'PATCH' : 'DELETE',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             swapRequestId: currentSwapRequest.id,
//             receiver: currentSwapRequest.profile_receiverId,
//             requester: currentSwapRequest.profile_requesterId,
//             receiverRoster: currentSwapRequest.roster_receiverRosterId,
//             requesterRoster: currentSwapRequest.roster_requesterRosterId,
//           }),
//         }
//       );
//       const data = await res.json();

//       if (data?.status === 'error') {
//         toast.error(
//           data?.message || 'Cannot update swap request, something went wrong',
//           {
//             id: toastId,
//           }
//         );
//       } else {
//         toast.success(data?.message || 'Swap request updated successfully', {
//           id: toastId,
//         });
//       }
//     } catch (error) {
//       console.error(error);
//     }

//     mutate();
//     setOpen(false);
//     setLoading(false);
//   }

//   return (
//     <Credenza open={open} onOpenChange={setOpen}>
//       <Tabs value={tabValue} onValueChange={setTabValue}>
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="receive">Offers received</TabsTrigger>
//           <TabsTrigger value="sent">Sent by me</TabsTrigger>
//         </TabsList>
//         <TabsContent value="receive" className="space-y-3">
//           <h3 className="scroll-m-20 font-semibold text-2xl tracking-tight">
//             Swaps Offers
//           </h3>
//           {received.length > 0 ? (
//             received.map((request) => (
//               <Card
//                 key={request.id}
//                 className="cursor-pointer"
//                 onClick={() => {
//                   setOpen(true);
//                   setCurrentSwapRequest(request);
//                 }}
//               >
//                 <CardContent className="grid grid-flow-col justify-stretch py-4">
//                   <div className="flex flex-col gap-2">
//                     <div className="flex flex-row">
//                       <Avatar className="size-10">
//                         <AvatarImage
//                           className="rounded-xl object-cover"
//                           src={
//                             request.profile_requesterId.user.image || undefined
//                           }
//                         />
//                         <AvatarFallback>CN</AvatarFallback>
//                       </Avatar>
//                       <span className="ml-4 flex items-center justify-center align-middle text-lg">
//                         {request.profile_requesterId.user.name}
//                       </span>
//                     </div>
//                     <div className="flex flex-row">
//                       <Icons.calendar className="size-4" />
//                       <span className="ml-2 flex items-center justify-center align-middle text-muted-foreground text-xs">
//                         {format(
//                           new Date(request.roster_requesterRosterId.dutyDate),
//                           'eee, PP'
//                         )}
//                       </span>
//                     </div>
//                     <div className="flex flex-row">
//                       <Icons.clock className="size-4" />
//                       <span className="ml-2 flex items-center justify-center align-middle text-muted-foreground text-xs">
//                         8:00 AM
//                       </span>
//                     </div>
//                   </div>

//                   <Icons.arrowBadgeLeft
//                     stroke={0.5}
//                     className="size-20 justify-self-center"
//                   />

//                   <div className="flex flex-col gap-2">
//                     <div className="flex flex-row">
//                       <Avatar className="size-10">
//                         <AvatarImage
//                           className="rounded-xl object-cover"
//                           src={
//                             request.profile_receiverId.user.image || undefined
//                           }
//                         />
//                         <AvatarFallback>CN</AvatarFallback>
//                       </Avatar>
//                       <span className="ml-4 flex items-center justify-center align-middle text-lg">
//                         {request.profile_receiverId.user.name}
//                       </span>
//                     </div>
//                     <div className="flex flex-row">
//                       <Icons.calendar className="size-4" />
//                       <span className="ml-2 flex items-center justify-center align-middle text-muted-foreground text-xs">
//                         {format(
//                           new Date(request.roster_receiverRosterId.dutyDate),
//                           'eee, PP'
//                         )}
//                       </span>
//                     </div>
//                     <div className="flex flex-row">
//                       <Icons.clock className="size-4" />
//                       <span className="ml-2 flex items-center justify-center align-middle text-muted-foreground text-xs">
//                         8:00 AM
//                       </span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           ) : (
//             <p>No requests to display</p>
//           )}
//         </TabsContent>
//         <TabsContent value="sent" className="space-y-3">
//           <h3 className="scroll-m-20 font-semibold text-2xl tracking-tight">
//             Pending Approval
//           </h3>
//           {sentByMe.length > 0 ? (
//             sentByMe.map((request) => (
//               <Card
//                 key={request.id}
//                 className="cursor-pointer"
//                 onClick={() => {
//                   setOpen(true);
//                   setCurrentSwapRequest(request);
//                 }}
//               >
//                 <CardContent className="grid grid-flow-col justify-stretch py-4">
//                   <div className="flex flex-col gap-2">
//                     <div className="flex flex-row">
//                       <Avatar className="size-10">
//                         <AvatarImage
//                           className="rounded-xl object-cover"
//                           src={
//                             request.profile_requesterId.user.image || undefined
//                           }
//                         />
//                         <AvatarFallback>CN</AvatarFallback>
//                       </Avatar>
//                       <span className="ml-4 flex items-center justify-center align-middle text-lg">
//                         {request.profile_requesterId.user.name}
//                       </span>
//                     </div>
//                     <div className="flex flex-row">
//                       <Icons.calendar className="size-4" />
//                       <span className="ml-2 flex items-center justify-center align-middle text-muted-foreground text-xs">
//                         {format(
//                           new Date(request.roster_requesterRosterId.dutyDate),
//                           'eee, PP'
//                         )}
//                       </span>
//                     </div>
//                     <div className="flex flex-row">
//                       <Icons.clock className="size-4" />
//                       <span className="ml-2 flex items-center justify-center align-middle text-muted-foreground text-xs">
//                         8:00 AM
//                       </span>
//                     </div>
//                   </div>

//                   <Icons.arrowBadgeRight
//                     stroke={0.5}
//                     className="size-20 justify-self-center"
//                   />

//                   <div className="flex flex-col gap-2">
//                     <div className="flex flex-row">
//                       <Avatar className="size-10">
//                         <AvatarImage
//                           className="rounded-xl object-cover"
//                           src={
//                             request.profile_receiverId.user.image || undefined
//                           }
//                         />
//                         <AvatarFallback>CN</AvatarFallback>
//                       </Avatar>
//                       <span className="ml-4 flex items-center justify-center align-middle text-lg">
//                         {request.profile_receiverId.user.name}
//                       </span>
//                     </div>
//                     <div className="flex flex-row">
//                       <Icons.calendar className="size-4" />
//                       <span className="ml-2 flex items-center justify-center align-middle text-muted-foreground text-xs">
//                         {format(
//                           new Date(request.roster_receiverRosterId.dutyDate),
//                           'eee, PP'
//                         )}
//                       </span>
//                     </div>
//                     <div className="flex flex-row">
//                       <Icons.clock className="size-4" />
//                       <span className="ml-2 flex items-center justify-center align-middle text-muted-foreground text-xs">
//                         8:00 AM
//                       </span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           ) : (
//             <p>
//               No requests to display, you can request to swap duties{' '}
//               <Link
//                 className="font-medium text-primary underline underline-offset-4"
//                 href="/duty-roster"
//               >
//                 here
//               </Link>
//               !
//             </p>
//           )}
//         </TabsContent>
//       </Tabs>

//       <CredenzaContent className="min-w-[300px] md:min-w-[750px]">
//         <CredenzaHeader>
//           <CredenzaTitle>Swap Details</CredenzaTitle>
//         </CredenzaHeader>

//         <CredenzaBody className="space-y-3">
//           {currentSwapRequest && (
//             <>
//               {/* <ArcherContainer
//                 strokeColor="red"
//                 lineStyle="curve"
//                 endMarker={false}
//               > */}
//               <Calendar
//                 month={
//                   new Date(currentSwapRequest.roster_requesterRosterId.dutyDate)
//                 }
//                 disableNavigation
//                 mode="default"
//                 className="rounded-md border"
//                 classNames={{
//                   day_today: '',
//                   day: 'h-8 w-8 p-0 font-normal aria-selected:opacity-100 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
//                   day_selected:
//                     'bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground',
//                 }}
//                 //   components={{
//                 //     DayContent: (props) => DateTime(props),
//                 //   }}
//                 modifiers={{
//                   requesterRoster: [
//                     new Date(
//                       currentSwapRequest.roster_requesterRosterId.dutyDate
//                     ),
//                   ],
//                   receiverRoster: [
//                     new Date(
//                       currentSwapRequest.roster_receiverRosterId.dutyDate
//                     ),
//                   ],
//                 }}
//                 modifiersStyles={{
//                   requesterRoster: { border: '2px solid currentColor' },
//                   receiverRoster: { border: '2px solid currentColor' },
//                 }}
//               />
//               {/* </ArcherContainer> */}

//               <div className="relative grid grid-cols-2 gap-4">
//                 <Card>
//                   <CardHeader className="items-center justify-center text-center">
//                     <Avatar className="size-16">
//                       <AvatarImage
//                         className="object-cover"
//                         src={
//                           currentSwapRequest.profile_requesterId.user.image ||
//                           undefined
//                         }
//                       />
//                       <AvatarFallback>CN</AvatarFallback>
//                     </Avatar>
//                     <CardTitle>
//                       {currentSwapRequest.profile_requesterId.user.name}{' '}
//                       {session?.user.id ===
//                         currentSwapRequest.profile_requesterId.user.id &&
//                         '(you)'}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-sm">
//                       Date:{' '}
//                       <span className="text-muted-foreground">
//                         {format(
//                           new Date(
//                             currentSwapRequest.roster_requesterRosterId.dutyDate
//                           ),
//                           'PPPP'
//                         )}
//                       </span>
//                     </p>
//                     <p className="text-sm">
//                       Time:{' '}
//                       <span className="text-muted-foreground">8:00AM</span>
//                     </p>
//                   </CardContent>
//                 </Card>

//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="absolute bottom-[40%] left-[calc(50%-25px)] size-12 cursor-default rounded-full hover:bg-background"
//                 >
//                   <Icons.arrowExchange className="size-8" />
//                 </Button>

//                 <Card>
//                   <CardHeader className="items-center justify-center text-center">
//                     <Avatar className="size-16">
//                       <AvatarImage
//                         className="object-cover"
//                         src={
//                           currentSwapRequest.profile_receiverId.user.image ||
//                           undefined
//                         }
//                       />
//                       <AvatarFallback>CN</AvatarFallback>
//                     </Avatar>
//                     <CardTitle>
//                       {currentSwapRequest.profile_receiverId.user.name}{' '}
//                       {session?.user.id ===
//                         currentSwapRequest.profile_receiverId.user.id &&
//                         '(you)'}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-sm">
//                       Date:{' '}
//                       <span className="text-muted-foreground">
//                         {format(
//                           new Date(
//                             currentSwapRequest.roster_receiverRosterId.dutyDate
//                           ),
//                           'PPPP'
//                         )}
//                       </span>
//                     </p>
//                     <p className="text-sm">
//                       Time:{' '}
//                       <span className="text-muted-foreground">8:00AM</span>
//                     </p>
//                   </CardContent>
//                 </Card>
//               </div>
//               <div className="grid w-full items-center gap-1.5">
//                 <Label htmlFor="email">Reason</Label>
//                 <Textarea
//                   readOnly
//                   className="cursor-default resize-none"
//                   value={currentSwapRequest?.reason || 'No reason provided'}
//                 />
//               </div>
//             </>
//           )}
//         </CredenzaBody>

//         <CredenzaFooter className="flex-row">
//           {tabValue === 'receive' ? (
//             <>
//               <LoadingButton
//                 className="w-full md:w-24"
//                 variant="destructive"
//                 onClick={handleSwapRequest}
//                 loading={loading}
//               >
//                 Deny
//               </LoadingButton>
//               <LoadingButton
//                 className="w-full bg-emerald-600 text-white hover:bg-emerald-600/90 md:w-24"
//                 onClick={handleSwapRequest}
//                 loading={loading}
//               >
//                 Approve
//               </LoadingButton>
//             </>
//           ) : (
//             <LoadingButton
//               className="w-full md:w-36"
//               variant="secondary"
//               onClick={handleSwapRequest}
//               loading={loading}
//             >
//               Cancel Request
//             </LoadingButton>
//           )}
//         </CredenzaFooter>
//       </CredenzaContent>
//     </Credenza>
//   );
// }
