'use server';

import 'server-only';

import { type User } from '@supabase/supabase-js';
import { isWeekend } from 'date-fns';

import {
  demoUsers,
  dutyRoster,
  notifications,
  swapRequests,
  upcomingDuties,
} from '@/lib/demo-data';
import { type DutyDate } from '@/lib/duty-roster';
import {
  type RosterPatch,
  type TypedSupabaseClient,
  getAllUsersByUnitId,
  getNotificationsById,
  getRosterByUnitId,
  getSwapRequestByUnitId,
  getUserProfileById,
  getUserUpcomingDuties,
} from '@/lib/supabase/queries';
import { isDemoUser } from '@/utils/helper';
import { indexOnceWithKey } from '@/utils/helper';

export async function getRosterData(
  client: TypedSupabaseClient,
  user: User,
  month: string,
  year: string
) {
  let data = dutyRoster;

  if (!isDemoUser(user.id)) {
    const userGroups = user?.app_metadata?.groups;
    const currentGroupId = Object.keys(userGroups)?.[0]; //TODO: handle multiple groups

    const { data: roster, error } = await getRosterByUnitId(
      client,
      month,
      year,
      currentGroupId
    );

    if (!data || error) {
      throw new Error('Failed to fetch roster');
    }

    data = roster;
  }

  const transformedData: DutyDate[] = data.map((item: RosterPatch) => ({
    id: item.id,
    date: item.duty_date,
    isExtra: item.is_extra,
    isWeekend: isWeekend(new Date(item.duty_date)),
    blockout: [],
    personnel: item.duty_personnel,
    reservePersonnel: item.reserve_duty_personnel,
    allocated: false,
  }));

  const roster = indexOnceWithKey(transformedData, 'date');
  return JSON.parse(JSON.stringify(roster)) as Record<string, DutyDate>;
}

export async function getUsersProfileData(
  client: TypedSupabaseClient,
  user: User
) {
  if (isDemoUser(user.id)) {
    return demoUsers;
  }

  const userGroups = user?.app_metadata?.groups;
  const currentGroupId = Object.keys(userGroups)?.[0]; //TODO: handle multiple groups

  const { data: users, error } = await getAllUsersByUnitId(
    client,
    currentGroupId
  );

  if (!users || error) {
    throw new Error('Failed to fetch users');
  }

  return users;
}

export async function getUserProfileData(
  client: TypedSupabaseClient,
  user: User
) {
  if (isDemoUser(user.id)) {
    return demoUsers[0];
  }

  const userGroups = user?.app_metadata?.groups;
  const currentGroupId = Object.keys(userGroups)?.[0]; //TODO: handle multiple groups

  const { data, error } = await getUserProfileById(
    client,
    user.id,
    currentGroupId
  );

  if (!data || error) {
    throw new Error('Failed to fetch profile');
  }

  return data;
}

export async function getUserUpcomingDutiesData(
  client: TypedSupabaseClient,
  user: User
) {
  if (isDemoUser(user.id)) {
    return upcomingDuties;
  }

  const userGroups = user?.app_metadata?.groups;
  const currentGroupId = Object.keys(userGroups)?.[0]; //TODO: handle multiple groups

  const { data, error } = await getUserUpcomingDuties(
    client,
    user.id,
    currentGroupId
  );

  if (!data || error) {
    throw new Error('Failed to fetch upcoming duties');
  }

  return data;
}

export async function getUserSwapRequestData(
  client: TypedSupabaseClient,
  user: User
) {
  if (isDemoUser(user.id)) {
    return swapRequests;
  }

  const userGroups = user?.app_metadata?.groups;
  const currentGroupId = Object.keys(userGroups)?.[0]; //TODO: handle multiple groups

  const { data, error } = await getSwapRequestByUnitId(client, currentGroupId);

  if (!data || error) {
    throw new Error('Failed to fetch swap requests');
  }

  return data;
}

export async function getUserNotificationData(
  client: TypedSupabaseClient,
  user: User
) {
  if (isDemoUser(user.id)) {
    return { count: notifications.length, data: notifications };
  }

  const { data, error } = await getNotificationsById(client);

  const { count } = await client
    .from('notifications')
    .select('*', { count: 'estimated', head: true })
    .is('is_read', false);

  if (!data || error) {
    throw new Error('Failed to fetch notifications');
  }

  return { count, data };
}
