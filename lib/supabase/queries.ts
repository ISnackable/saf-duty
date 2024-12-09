import { SupabaseClient } from '@supabase/supabase-js';
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  startOfMonth,
  subDays,
} from 'date-fns';

import type { Database } from '@/types/supabase';
import type { Tables } from '@/types/supabase';

export interface RosterPatch
  extends Pick<Tables<'rosters'>, 'id' | 'duty_date' | 'is_extra'> {
  duty_personnel: Pick<Profiles, 'id' | 'name' | 'avatar_url'> | null;
  reserve_duty_personnel: Pick<Profiles, 'id' | 'name' | 'avatar_url'> | null;
}

export type TypedSupabaseClient = SupabaseClient<Database>;
export type Profiles = Omit<Tables<'profiles'>, 'updated_at'> & {
  role: 'admin' | 'user' | 'manager' | null;
  total_duty_done: number;
};
export interface SwapRequests
  extends Omit<
    Tables<'swap_requests'>,
    | 'updated_at'
    | 'receiver_id'
    | 'requester_id'
    | 'receiver_roster_id'
    | 'requester_roster_id'
  > {
  receiver: Pick<Profiles, 'id' | 'name' | 'avatar_url'>;
  requester: Pick<Profiles, 'id' | 'name' | 'avatar_url'>;
  receiver_roster: RosterPatch;
  requester_roster: RosterPatch;
}

// * With RLS in place, we should be able to remove the unitId from the query.
export function getRosterByUnitId(
  client: TypedSupabaseClient,
  month: string,
  year: string,
  unitId: string
) {
  let monthDate = startOfMonth(new Date(`${month} ${year}`));

  return client
    .from('rosters')
    .select(
      `
      id,
      duty_date,
      is_extra,
      duty_personnel:duty_personnel_id(id, name, avatar_url),
      reserve_duty_personnel:reserve_duty_personnel_id(id, name, avatar_url)
    `
    )
    .eq('group_id', unitId)
    .lte('duty_date', format(addDays(endOfMonth(monthDate), 8), 'yyyy-MM-dd'))
    .gte('duty_date', format(subDays(monthDate, 8), 'yyyy-MM-dd'))
    .returns<RosterPatch[]>();
}

export function getAllUsersByUnitId(
  client: TypedSupabaseClient,
  unitId: string
) {
  const TODAY = format(new Date(), 'yyyy-MM-dd');

  return client
    .from('profiles')
    .select(
      `
      id,
      created_at,
      name,
      email,
      avatar_url,
      group_id,
      blockout_dates,
      max_blockouts,
      weekday_points,
      weekend_points,
      ord_date,
      no_of_extras,
      onboarded,
      user_settings,
      role:group_users!user_id (role),
      total_duty_done:rosters!rosters_duty_personnel_id_fkey(count)
      `
    )
    .lt('rosters.duty_date', TODAY)
    .eq('group_id', unitId)
    .eq('group_users.group_id', unitId) // Filter for the specific group_id
    .returns<Profiles[]>()
    .then((res) => {
      const profiles = res.data;
      if (profiles && profiles.length) {
        profiles.forEach((profile) => {
          // @ts-ignore - Hacky way to flatten the role
          if (profile.role.length) profile.role = profile.role[0].role; // Extract role as a flat string
          // @ts-ignore - Hacky way to flatten the role
          profile.total_duty_done = profile.total_duty_done[0].count || 0;
        });
      }
      return res;
    });
}

export function getUserProfileById(
  client: TypedSupabaseClient,
  userId: string,
  unitId: string
) {
  const TODAY = format(new Date(), 'yyyy-MM-dd');

  return client
    .from('profiles')
    .select(
      `
      id,
      created_at,
      name,
      email,
      avatar_url,
      group_id,
      blockout_dates,
      max_blockouts,
      weekday_points,
      weekend_points,
      ord_date,
      no_of_extras,
      onboarded,
      user_settings,
      role:group_users!user_id (role),
      total_duty_done:rosters!rosters_duty_personnel_id_fkey(count)
      `
    )
    .eq('id', userId)
    .eq('group_id', unitId)
    .eq('group_users.group_id', unitId) // Filter for the specific group_id
    .lt('rosters.duty_date', TODAY)
    .single<Profiles>()
    .then((res) => {
      const profile = res.data;
      if (profile) {
        // @ts-ignore - Hacky way to flatten the role
        profile.role = profile.role[0].role; // Extract role as a flat string
        // @ts-ignore - Hacky way to flatten the role
        profile.total_duty_done = profile.total_duty_done[0].count || 0;
      }
      return res;
    });
}

export function getUserUpcomingDuties(
  client: TypedSupabaseClient,
  userId: string,
  unitId: string
) {
  const TODAY = new Date();
  const firstDate = format(startOfMonth(TODAY), 'yyyy-MM-dd');
  const lastDate = format(endOfMonth(addMonths(firstDate, 1)), 'yyyy-MM-dd');

  return client
    .from('rosters')
    .select(
      `
      id,
      duty_date,
      is_extra,
      duty_personnel:duty_personnel_id(id, name, avatar_url),
      reserve_duty_personnel:reserve_duty_personnel_id(id, name, avatar_url)
    `
    )
    .eq('duty_personnel_id', userId)
    .eq('group_id', unitId)
    .gte('duty_date', firstDate)
    .lte('duty_date', lastDate)
    .order('duty_date', { ascending: true })
    .returns<RosterPatch[]>();
}

export function getSwapRequestByUnitId(
  client: TypedSupabaseClient,
  unitId: string
) {
  return client
    .from('swap_requests')
    .select(
      `
      id,
      status,
      reason,
      receiver:receiver_id(id, name, avatar_url),
      requester:requester_id(id, name, avatar_url),
      receiver_roster:receiver_roster_id(
        id,
        duty_date,
        is_extra,
        duty_personnel:duty_personnel_id(id, name, avatar_url),
        reserve_duty_personnel:reserve_duty_personnel_id(id, name, avatar_url)
      ),
      requester_roster:requester_roster_id(
        id,
        duty_date,
        is_extra,
        duty_personnel:duty_personnel_id(id, name, avatar_url),
        reserve_duty_personnel:reserve_duty_personnel_id(id, name, avatar_url)
      )
    `
    )
    .eq('group_id', unitId)
    .returns<SwapRequests[]>();
}

export function getNotificationsById(client: TypedSupabaseClient) {
  return client
    .from('notifications')
    .select('id, created_at, title, message, is_read, action')
    .order('created_at', { ascending: true });
}
