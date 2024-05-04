import {
  addDays,
  format,
  formatISO,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  subDays,
} from 'date-fns';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAuth } from '@/lib/auth-handler';
import type { DutyDate } from '@/lib/duty-roster';
import {
  getRosterData,
  getUserSwapRequestData,
  getUsersProfileData,
} from '@/lib/supabase/data';

const personnelSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const dutyDateSchema = z.object({
  id: z.number(),
  date: z.string(),
  isExtra: z.boolean(),
  isWeekend: z.boolean(),
  blockout: z.array(z.string()),
  personnel: personnelSchema,
  reservePersonnel: personnelSchema,
  allocated: z.boolean(),
});

const swapRequestsSchema = z.object({
  receiverRoster: dutyDateSchema,
  receiver: personnelSchema,
  requesterRoster: dutyDateSchema,
  requester: personnelSchema,
  reason: z
    .string()
    .max(100, { message: 'Reason must be less than 100 characters' })
    .optional(),
});

export const GET = withAuth(
  async ({ params, client, user }) => {
    try {
      if (params.id !== user.id) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Unauthorized',
          },
          { status: 401 }
        );
      }

      const data = await getUserSwapRequestData(client, user);

      return NextResponse.json(
        {
          status: 'success',
          message: 'Successfully retrieved swap requests',
          data: data,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to retrieve swap requests',
        },
        { status: 500 }
      );
    }
  },
  { allowDemoUser: true }
);

export const POST = withAuth(async ({ request, params, client, user }) => {
  try {
    if (params.id !== user.id) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const data = await request.json();
    const validatedFields = swapRequestsSchema.safeParse(data);

    if (!validatedFields.success) {
      throw new Error('Invalid request body');
    }

    const { error } = await client.from('swap_requests').insert({
      group_id: user.app_metadata.groups.id,
      reason: data.reason,
      receiver_id: data.receiver.id,
      receiver_roster_id: data.receiverRoster.id,
      requester_id: user.id,
      requester_roster_id: data.requesterRoster.id,
    });

    if (error) {
      switch (error.code) {
        case '23505':
          throw new Error('Swap request already exists');
        case 'P0001':
          throw new Error(error.message);
        default:
          throw new Error('Failed to create swap request');
      }
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Successfully created swap request',
      },
      { status: 201 }
    );
  } catch (error) {
    let message = 'Failed to create swap request';
    if (error instanceof Error) message = error.message;

    return NextResponse.json(
      {
        status: 'error',
        message,
      },
      { status: 500 }
    );
  }
});

const updateDutyDateSchema = z.object({
  id: z.number(),
  duty_date: z
    .string()
    .pipe(z.coerce.date())
    .transform((date) => formatISO(date, { representation: 'date' })),
  is_extra: z.boolean(),
  duty_personnel: personnelSchema,
  reserve_duty_personnel: personnelSchema,
});

const updateSwapRequestSchema = z.object({
  swapRequestId: z.number(),
  receiverRoster: updateDutyDateSchema,
  receiver: personnelSchema,
  requesterRoster: updateDutyDateSchema,
  requester: personnelSchema,
});

type UpdateSwapRequest = z.infer<typeof updateSwapRequestSchema>;

export const DELETE = withAuth(async ({ request, params, client, user }) => {
  try {
    if (params.id !== user.id) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }
    const data = await request.json();

    const validatedFields = updateSwapRequestSchema.safeParse(data);

    if (!validatedFields.success) {
      throw new Error('Invalid request body');
    }

    // RLS is configured to only allow the requester to delete their own swap request
    const { error } = await client.from('swap_requests').delete().match({
      id: validatedFields.data.swapRequestId,
      group_id: user.app_metadata.groups.id,
      requester_id: validatedFields.data.requester.id,
      receiver_id: validatedFields.data.receiver.id,
    });

    if (error) {
      throw new Error('Failed to delete swap request');
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Deleted the swap request',
      },
      { status: 200 }
    );
  } catch (error) {
    let message = 'Failed to delete swap request';
    if (error instanceof Error) message = error.message;

    return NextResponse.json(
      {
        status: 'error',
        message,
      },
      { status: 500 }
    );
  }
});

function getPreviousRosterDate(roster: Record<string, DutyDate>, date: string) {
  return isFirstDayOfMonth(date)
    ? null
    : roster[formatISO(subDays(date, 1), { representation: 'date' })];
}

function getNextRosterDate(roster: Record<string, DutyDate>, date: string) {
  return isLastDayOfMonth(date)
    ? null
    : roster[formatISO(addDays(date, 1), { representation: 'date' })];
}

export const PATCH = withAuth(async ({ request, params, client, user }) => {
  try {
    if (params.id !== user.id) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    let data: UpdateSwapRequest = await request.json();
    const validatedFields = updateSwapRequestSchema.safeParse(data);
    if (!validatedFields.success) {
      throw new Error('Invalid request body');
    }
    data = validatedFields.data;

    if (
      data.requesterRoster.duty_personnel.id !== data.requester.id ||
      data.receiverRoster.duty_personnel.id !== data.receiver.id
    ) {
      await client.from('swap_requests').delete().match({
        id: data.swapRequestId,
        group_id: user.app_metadata.groups.id,
        receiver_id: user.id,
      });

      throw new Error(
        'Request is not valid anymore, this could be due to someone already swapped the same shift.'
      );
    }

    const [roster, allUsers] = await Promise.all([
      getRosterData(
        client,
        user,
        format(data.requesterRoster.duty_date, 'MMMM'),
        format(data.requesterRoster.duty_date, 'yyyy')
      ),
      getUsersProfileData(client, user),
    ]);

    const requesterRoster = roster[data.requesterRoster.duty_date];
    const receiverRoster = roster[data.receiverRoster.duty_date];

    if (
      !requesterRoster ||
      !receiverRoster ||
      !requesterRoster.personnel ||
      !receiverRoster.personnel ||
      !requesterRoster.reservePersonnel ||
      !receiverRoster.reservePersonnel
    ) {
      throw new Error('Invalid roster date');
    }

    const previousRequesterRoster = getPreviousRosterDate(
      roster,
      data.requesterRoster.duty_date
    );
    const previousReceiverRoster = getPreviousRosterDate(
      roster,
      data.receiverRoster.duty_date
    );
    const nextRequesterRoster = getNextRosterDate(
      roster,
      data.requesterRoster.duty_date
    );
    const nextReceiverRoster = getNextRosterDate(
      roster,
      data.receiverRoster.duty_date
    );

    // Get all the users who are available on the requester date
    const availableUsersOnRequesterDate = allUsers.filter((user) => {
      const { blockout_dates } = user;

      if (user.id === data.requester.id) return false;
      else if (!blockout_dates) return false;
      else if (
        (previousRequesterRoster?.personnel &&
          previousRequesterRoster.personnel.id === user.id) ||
        (previousRequesterRoster?.reservePersonnel &&
          previousRequesterRoster.reservePersonnel.id === user.id) ||
        (nextRequesterRoster?.personnel &&
          nextRequesterRoster.personnel.id === user.id) ||
        (nextRequesterRoster?.reservePersonnel &&
          nextRequesterRoster.reservePersonnel.id === user.id)
      ) {
        return false;
      } else if (
        (previousRequesterRoster?.personnel &&
          previousRequesterRoster.personnel.id ===
            requesterRoster?.reservePersonnel?.id) ||
        (previousRequesterRoster?.reservePersonnel &&
          previousRequesterRoster.reservePersonnel.id ===
            requesterRoster?.reservePersonnel?.id) ||
        (nextRequesterRoster?.personnel &&
          nextRequesterRoster.personnel.id ===
            requesterRoster?.reservePersonnel?.id) ||
        (nextRequesterRoster?.reservePersonnel &&
          nextRequesterRoster.reservePersonnel.id ===
            requesterRoster?.reservePersonnel?.id)
      ) {
        return false;
      }

      const isAvailable = !blockout_dates.includes(
        data.requesterRoster.duty_date
      );

      return isAvailable;
    });

    // Get all the users who are available on the receiver date
    const availableUsersOnReceiverDate = allUsers.filter((user) => {
      const { blockout_dates } = user;

      if (user.id === data.receiver.id) return false;
      else if (!blockout_dates) return false;
      else if (
        (previousRequesterRoster?.personnel &&
          previousRequesterRoster.personnel.id === user.id) ||
        (previousRequesterRoster?.reservePersonnel &&
          previousRequesterRoster.reservePersonnel.id === user.id) ||
        (nextRequesterRoster?.personnel &&
          nextRequesterRoster.personnel.id === user.id) ||
        (nextRequesterRoster?.reservePersonnel &&
          nextRequesterRoster.reservePersonnel.id === user.id)
      ) {
        return false;
      } else if (
        (previousReceiverRoster?.personnel &&
          previousReceiverRoster.personnel.id ===
            receiverRoster?.reservePersonnel?.id) ||
        (previousReceiverRoster?.reservePersonnel &&
          previousReceiverRoster.reservePersonnel.id ===
            receiverRoster?.reservePersonnel?.id) ||
        (nextReceiverRoster?.personnel &&
          nextReceiverRoster.personnel.id ===
            receiverRoster?.reservePersonnel?.id) ||
        (nextReceiverRoster?.reservePersonnel &&
          nextReceiverRoster.reservePersonnel.id ===
            receiverRoster?.reservePersonnel?.id)
      ) {
        return false;
      }
      const isAvailable = !blockout_dates.includes(
        data.receiverRoster.duty_date
      );

      return isAvailable;
    });

    if (
      !availableUsersOnRequesterDate.length ||
      !availableUsersOnReceiverDate.length
    ) {
      throw new Error(
        'There are no available stand-in users for the requester or receiver date'
      );
    }

    // By default, the stand-in will be the same as the original standin
    let newRequesterStandIn = requesterRoster.reservePersonnel.id;
    let newReceiverStandIn = receiverRoster.reservePersonnel.id;

    if (
      requesterRoster.reservePersonnel.id === data.receiver.id ||
      (previousRequesterRoster?.personnel &&
        previousRequesterRoster.personnel.id ===
          requesterRoster.reservePersonnel.id) ||
      (previousRequesterRoster?.reservePersonnel &&
        previousRequesterRoster.reservePersonnel.id ===
          requesterRoster.reservePersonnel.id) ||
      (nextRequesterRoster?.personnel &&
        nextRequesterRoster.personnel.id ===
          requesterRoster.reservePersonnel.id) ||
      (nextRequesterRoster?.reservePersonnel &&
        nextRequesterRoster.reservePersonnel.id ===
          requesterRoster.reservePersonnel.id)
    ) {
      // Assign a random user from the availableUsersOnRequesterDate
      newRequesterStandIn =
        availableUsersOnRequesterDate[
          Math.floor(Math.random() * availableUsersOnRequesterDate.length)
        ].id;
    }

    if (
      receiverRoster.reservePersonnel.id === data.requester.id ||
      (previousReceiverRoster?.personnel &&
        previousReceiverRoster.personnel.id ===
          receiverRoster.reservePersonnel.id) ||
      (previousReceiverRoster?.reservePersonnel &&
        previousReceiverRoster.reservePersonnel.id ===
          receiverRoster.reservePersonnel.id) ||
      (nextReceiverRoster?.personnel &&
        nextReceiverRoster.personnel.id ===
          receiverRoster.reservePersonnel.id) ||
      (nextReceiverRoster?.reservePersonnel &&
        nextReceiverRoster.reservePersonnel.id ===
          receiverRoster.reservePersonnel.id)
    ) {
      // Assign a random user from the availableUsersOnReceiverDate
      newReceiverStandIn =
        availableUsersOnReceiverDate[
          Math.floor(Math.random() * availableUsersOnReceiverDate.length)
        ].id;
    }

    const { error } = await client.rpc('update_rosters_swap_requests', {
      _receiver_roster_id: data.receiverRoster.id,
      _requester_roster_id: data.requesterRoster.id,
      receiver_id: data.receiver.id,
      requester_id: data.requester.id,
      reserve_receiver_id: newReceiverStandIn,
      reserve_requester_id: newRequesterStandIn,
      receiver_extra: data.receiverRoster.is_extra,
      requester_extra: data.requesterRoster.is_extra,
    });

    if (error) {
      console.error(error);
      throw new Error('Failed to update swap request');
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Successfully swapped the duty',
      },
      { status: 200 }
    );
  } catch (error) {
    let message = 'Failed to update swap request';
    if (error instanceof Error) message = error.message;

    return NextResponse.json(
      {
        status: 'error',
        message,
      },
      { status: 500 }
    );
  }
});
