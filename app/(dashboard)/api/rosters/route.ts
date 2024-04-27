import { NextResponse } from 'next/server';
import * as z from 'zod';

import { withAuth } from '@/lib/auth-handler';
import { type DutyDate, type Personnel } from '@/lib/duty-roster';
import { getRosterData } from '@/lib/supabase/data';
import { type Tables } from '@/types/supabase';
import { useMonthYear } from '@/utils/helper';

const dutyDateSchema = z.array(
  z.object({
    id: z.number().optional(),
    duty_date: z.string().pipe(z.coerce.date()),
    is_extra: z.boolean(),
    duty_personnel_id: z.string(),
    reserve_duty_personnel_id: z.string(),
    group_id: z.string(),
    updated_at: z.string().datetime().optional(),
  })
);

const personnelSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    weekday_points: z.number(),
    weekend_points: z.number(),
    no_of_extras: z.number(),
    group_id: z.string(),
    updated_at: z.string().datetime().optional(),
  })
);

export const GET = withAuth(
  async ({ request, user, client }) => {
    const { searchParams } = new URL(request.url);
    const { month, year } = useMonthYear(searchParams);

    try {
      const roster = await getRosterData(client, user, month, year);

      return NextResponse.json(
        {
          status: 'success',
          message: 'Successfully retrieved roster',
          data: roster,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to retrieve roster',
        },
        { status: 500 }
      );
    }
  },
  { allowDemoUser: true }
);

export const POST = withAuth(
  async ({ request, group, client }) => {
    const { dutyDates, dutyPersonnels } = await request.json();

    const roster: Tables<'rosters'>[] = dutyDates?.map((item: DutyDate) => ({
      ...(item.id && { id: item.id }),
      duty_date: item.date,
      is_extra: item.isExtra,
      duty_personnel_id: item.personnel?.id,
      reserve_duty_personnel_id: item.reservePersonnel?.id,
      group_id: group.id,
      updated_at: new Date().toISOString(),
    }));

    const personnels: Tables<'profiles'>[] = dutyPersonnels?.map(
      (item: Personnel) => ({
        id: item.id,
        name: item.name,
        weekday_points: item.weekdayPoints,
        weekend_points: item.weekendPoints,
        no_of_extras: item.extra,
        group_id: group.id, // Since profiles are unit specific, we can use the unit_id from the user
        updated_at: new Date().toISOString(),
      })
    );

    const { success: rosterSuccess } = dutyDateSchema.safeParse(roster);
    const { success: profilesSuccess } = personnelSchema.safeParse(personnels);

    if (!rosterSuccess || !profilesSuccess) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid roster data',
        },
        { status: 400 }
      );
    }

    const upsertRosterQuery = client
      .from('rosters')
      .upsert(roster, { onConflict: 'duty_date' })
      .select();

    const upsertProfilesQuery = client
      .from('profiles')
      .upsert(personnels)
      .select();

    const [rosterResult, profilesResult] = await Promise.all([
      upsertRosterQuery,
      upsertProfilesQuery,
    ]);

    if (rosterResult.error || profilesResult.error) {
      console.error(rosterResult.error, profilesResult.error);
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to add roster',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'Successfully added roster',
    });
  },
  { requiredRole: ['admin'] }
);
