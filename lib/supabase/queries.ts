import { SupabaseClient } from '@supabase/supabase-js';
import { addDays, endOfMonth, format, startOfMonth, subDays } from 'date-fns';

import { type RosterPatch } from '@/app/(dashboard)/api/rosters/route';
import type { Database } from '@/types/supabase';
import type { Tables } from '@/types/supabase';

export type TypedSupabaseClient = SupabaseClient<Database>;
export type Profiles = Omit<Tables<'profiles'>, 'updated_at'> & {
  role: 'admin' | 'user' | 'manager' | null;
};

// * With RLS in place, we should be able to remove the unitId from the query.
export function getRosterByUnitId(
  client: TypedSupabaseClient,
  month: string,
  year: string
) {
  let monthDate = startOfMonth(new Date(`${month} ${year}`));

  return client
    .from('rosters')
    .select(
      `
      id,
      duty_date,
      is_extra,
      duty_personnel:duty_personnel_id(id, name),
      reserve_duty_personnel:reserve_duty_personnel_id(id, name)
    `
    )
    .lte('duty_date', format(addDays(endOfMonth(monthDate), 8), 'yyyy-MM-dd'))
    .gte('duty_date', format(subDays(monthDate, 8), 'yyyy-MM-dd'))
    .returns<RosterPatch[]>();
}

export function getAllUsersByUnitId(client: TypedSupabaseClient) {
  return client
    .from('profiles')
    .select(
      'id, name, avatar_url, group_id, blockout_dates, max_blockouts, weekday_points, weekend_points, enlistment_date, ord_date, no_of_extras, onboarded, ...group_users(role)'
    )
    .returns<Profiles[]>();
}

// TODO: Instead of relying on the sessionId, we should be making use of RLS to ensure that the user can only access their own data.
export function getUserProfileById(
  client: TypedSupabaseClient,
  sessionId: string
) {
  return client
    .from('profiles')
    .select(
      'id, name, avatar_url, group_id, blockout_dates, max_blockouts, weekday_points, weekend_points, enlistment_date, ord_date, no_of_extras, onboarded, ...group_users(role)'
    )
    .eq('id', sessionId)
    .eq('group_users.user_id', sessionId)
    .single<Profiles>();
}
