'use server';

import 'server-only';

import { type User } from '@supabase/supabase-js';
import { isWeekend } from 'date-fns';

import { type RosterPatch } from '@/app/(dashboard)/api/rosters/route';
import { demoUsers, dutyRoster } from '@/lib/demo-data';
import { type DutyDate } from '@/lib/duty-roster';
import {
  type TypedSupabaseClient,
  getAllUsersByUnitId,
  getRosterByUnitId,
  getUserProfileById,
} from '@/lib/supabase/queries';
import { isDemoUser } from '@/utils/demo';
import { indexOnceWithKey } from '@/utils/helper';

export async function getRosterData(
  client: TypedSupabaseClient,
  user: User,
  month: string,
  year: string
) {
  let data: RosterPatch[] = dutyRoster;

  if (!isDemoUser(user.id)) {
    const { data: roster, error } = await getRosterByUnitId(
      client,
      month,
      year
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

  const { data: users, error } = await getAllUsersByUnitId(client);

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
    return {
      name: demoUsers[0].name,
      avatar_url: demoUsers[0].avatar_url,
      ord_date: demoUsers[0].ord_date,
      onboarded: demoUsers[0].onboarded,
    };
  } else {
    const { data, error } = await getUserProfileById(client, user.id);

    if (!data || error) {
      throw new Error('Failed to fetch profile');
    }

    return data;
  }
}
