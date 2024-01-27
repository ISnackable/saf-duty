import 'server-only';

import { type Session } from '@supabase/supabase-js';
import { isWeekend } from 'date-fns';

import { type RosterPatch } from '@/app/(dashboard)/api/roster/route';
import { demoUsers, dutyRoster } from '@/lib/demo-data';
import { type DutyDate } from '@/lib/duty-roster';
import {
  type TypedSupabaseClient,
  getAllUsersByUnitId,
  getRosterByUnitId,
  getUserBlockoutById,
  getUserProfileById,
} from '@/lib/supabase/queries';
import { isDemoUser } from '@/utils/demo';
import { indexOnceWithKey } from '@/utils/helper';

export async function getRosterData(
  client: TypedSupabaseClient,
  session: Session,
  month: string,
  year: string
) {
  let data: RosterPatch[] = dutyRoster;

  if (!isDemoUser(session.user.id)) {
    const { data: roster, error } = await getRosterByUnitId(
      client,
      session.user.app_metadata.unit_id,
      month,
      year
    );

    if (!data || error) {
      throw new Error('Failed to fetch profile');
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
  return JSON.parse(JSON.stringify(roster));
}

export async function getUsersData(
  client: TypedSupabaseClient,
  session: Session
) {
  if (isDemoUser(session.user.id)) {
    return demoUsers;
  }

  const { data: users, error } = await getAllUsersByUnitId(
    client,
    session.user.app_metadata.unit_id
  );

  if (!users || error) {
    throw new Error('Failed to fetch profile');
  }

  return users;
}

export async function getUserBlockoutData(
  client: TypedSupabaseClient,
  session: Session
) {
  if (isDemoUser(session.user.id)) {
    return {
      max_blockouts: demoUsers[0].max_blockouts,
      blockout_dates: demoUsers[0].blockout_dates,
    };
  } else {
    const { data, error } = await getUserBlockoutById(client, session.user.id);

    if (!data || error) {
      throw new Error('Failed to fetch profile');
    }

    return data;
  }
}

export async function getUserProfileData(
  client: TypedSupabaseClient,
  session: Session
) {
  if (isDemoUser(session.user.id)) {
    return {
      name: demoUsers[0].name,
      avatar_url: demoUsers[0].avatar_url,
      ord_date: demoUsers[0].ord_date,
    };
  } else {
    const { data, error } = await getUserProfileById(client, session.user.id);

    if (!data || error) {
      throw new Error('Failed to fetch profile');
    }

    return data;
  }
}
