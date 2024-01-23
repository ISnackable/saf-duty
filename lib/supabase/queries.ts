import { SupabaseClient } from '@supabase/supabase-js';
import { addDays, endOfMonth, format, startOfMonth, subDays } from 'date-fns';

import { type RosterPatch } from '@/app/(dashboard)/api/roster/route';
import type { Database } from '@/types/supabase';

export type TypedSupabaseClient = SupabaseClient<Database>;

export function getRosterByUnitId(
  client: TypedSupabaseClient,
  unitId: string,
  month: string,
  year: string
) {
  let monthDate = startOfMonth(new Date(`${month} ${year}`));

  return client
    .from('roster')
    .select(
      `
      id,
      duty_date,
      is_extra,
      duty_personnel(id, name),
      reserve_duty_personnel (id, name)
    `
    )
    .lte('duty_date', format(addDays(endOfMonth(monthDate), 8), 'yyyy-MM-dd'))
    .gte('duty_date', format(subDays(monthDate, 8), 'yyyy-MM-dd'))
    .eq('unit_id', unitId)
    .returns<RosterPatch[]>();
}

export function getAllUsersByUnitId(
  client: TypedSupabaseClient,
  unitId: string
) {
  return client
    .from('profiles')
    .select(
      'id, name, avatar_url, unit_id, blockout_dates, role, max_blockouts, weekday_points, weekend_points, enlistment_date, ord_date, no_of_extras'
    )
    .eq('unit_id', unitId);
}

export function getUserBlockoutById(
  client: TypedSupabaseClient,
  sessionId: string
) {
  return client
    .from('profiles')
    .select('max_blockouts, blockout_dates')
    .eq('id', sessionId)
    .single();
}

export function getUserProfileById(
  client: TypedSupabaseClient,
  sessionId: string
) {
  return client
    .from('profiles')
    .select('name, avatar_url')
    .eq('id', sessionId)
    .single();
}
