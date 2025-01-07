/**
 * @fileoverview
 * This file contains the code for fetching data from the database.
 * We are not using React cache API as we are using SWR for data fetching.
 * If we plan to use these functions with React Server Components, we can use React cache API.
 */
import 'server-only';

import { database } from '@repo/database';
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  startOfMonth,
  subDays,
} from 'date-fns';
import { cache } from 'react';

export const getRostersByOrgId = cache(
  async (orgId: string, month: string, year: string) => {
    const monthDate = startOfMonth(new Date(`${month} ${year}`));
    const startDate = format(subDays(startOfMonth(monthDate), 8), 'yyyy-MM-dd');
    const endDate = format(addDays(endOfMonth(monthDate), 8), 'yyyy-MM-dd');

    const data = await database.query.rosters.findMany({
      where: (roster, { eq, and, gte, lte }) =>
        and(
          eq(roster.organizationId, orgId),
          gte(roster.dutyDate, startDate),
          lte(roster.dutyDate, endDate)
        ),
      orderBy: (roster, { asc }) => [asc(roster.dutyDate)],
      columns: {
        id: true,
        dutyDate: true,
        isExtra: true,
      },
      with: {
        profile_dutyPersonnelId: {
          columns: {
            id: true,
          },
          with: { user: { columns: { id: true, name: true, image: true } } },
        },
        profile_reserveDutyPersonnelId: {
          columns: {
            id: true,
          },
          with: { user: { columns: { id: true, name: true, image: true } } },
        },
      },
    });

    return data;
  }
);

/**
 * Get the upcoming rosters for a user in an organization
 * @param userId The user id
 * @param orgId The organization id
 * @returns The upcoming rosters
 */
export const getRostersByUserId = cache(
  async (userId: string, orgId: string) => {
    const TODAY = new Date();
    const firstDate = format(startOfMonth(TODAY), 'yyyy-MM-dd');
    const lastDate = format(endOfMonth(addMonths(firstDate, 1)), 'yyyy-MM-dd');

    const data = await database.query.rosters.findMany({
      where: (roster, { eq, and, gte, lte }) =>
        and(
          eq(roster.organizationId, orgId),
          eq(roster.dutyPersonnelId, userId),
          gte(roster.dutyDate, firstDate),
          lte(roster.dutyDate, lastDate)
        ),
      orderBy: (roster, { asc }) => [asc(roster.dutyDate)],
      columns: {
        id: true,
        dutyDate: true,
        isExtra: true,
      },
      with: {
        profile_dutyPersonnelId: {
          columns: {
            id: true,
          },
          with: { user: { columns: { id: true, name: true, image: true } } },
        },
        profile_reserveDutyPersonnelId: {
          columns: {
            id: true,
          },
          with: { user: { columns: { id: true, name: true, image: true } } },
        },
      },
    });

    return data;
  }
);

export const getProfilesByOrgId = cache(async (orgId: string) => {
  const data = await database.query.profiles.findMany({
    where: (profile, { eq }) => eq(profile.organizationId, orgId),
    columns: {
      id: true,
      blockoutDates: true,
      maxBlockouts: true,
      weekdayPoints: true,
      weekendPoints: true,
      ordDate: true,
      noOfExtras: true,
      userSettings: true,
    },
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return data;
});

export const getProfilesByUserId = cache(
  async (userId: string, orgId: string) => {
    const data = await database.query.profiles.findFirst({
      where: (profile, { eq, and }) =>
        and(eq(profile.userId, userId), eq(profile.organizationId, orgId)),
      columns: {
        id: true,
        blockoutDates: true,
        maxBlockouts: true,
        weekdayPoints: true,
        weekendPoints: true,
        ordDate: true,
        noOfExtras: true,
        userSettings: true,
      },
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return data;
  }
);

export const getSwapRequestsByUserId = cache(
  async (userId: string, orgId: string) => {
    const data = await database.query.swapRequests.findMany({
      where: (swapRequest, { eq, and, or }) =>
        and(
          eq(swapRequest.organizationId, orgId),
          or(
            eq(swapRequest.requesterId, userId),
            eq(swapRequest.receiverId, userId)
          )
        ),
      columns: {
        id: true,
        reason: true,
      },
      with: {
        profile_receiverId: {
          columns: {
            id: true,
          },
          with: { user: { columns: { id: true, name: true, image: true } } },
        },
        profile_requesterId: {
          columns: {
            id: true,
          },
          with: { user: { columns: { id: true, name: true, image: true } } },
        },
        roster_receiverRosterId: {
          columns: {
            id: true,
            dutyDate: true,
            isExtra: true,
          },
        },
        roster_requesterRosterId: {
          columns: {
            id: true,
            dutyDate: true,
            isExtra: true,
          },
        },
      },
    });

    return data;
  }
);

export const getNotificationsByUserId = cache(
  async (userId: string, orgId: string) => {
    const data = await database.query.notifications.findMany({
      where: (notification, { eq, and }) =>
        and(
          eq(notification.dutyPersonnelId, userId),
          eq(notification.organizationId, orgId)
        ),
      columns: {
        id: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
    });

    return data;
  }
);
