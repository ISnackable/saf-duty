import { NextResponse } from 'next/server';
import * as z from 'zod';

// import { useMonthYear } from '@/hooks/use-month-year';
import { withAuth } from '@/lib/auth';
// import { dutyRoster } from '@/lib/demo-data';
import { type DutyDate, type Personnel } from '@/lib/duty-roster';
import { type Tables } from '@/types/supabase';

// import { isDemoUser } from '@/utils/demo';

const DutyDateSchema = z.array(
  z.object({
    id: z.number().optional(),
    duty_date: z.coerce.date(),
    is_extra: z.boolean(),
    duty_personnel_id: z.string(),
    reserve_duty_personnel_id: z.string(),
    group_id: z.string(),
    updated_at: z.string().datetime().optional(),
  })
);

const PersonnelSchema = z.array(
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

export interface RosterPatch
  extends Pick<Tables<'rosters'>, 'id' | 'duty_date' | 'is_extra'> {
  duty_personnel: { id: string; name: string } | null;
  reserve_duty_personnel: { id: string; name: string } | null;
}

// export const GET = withAuth(
//   async ({ request, session }) => {
//     const { searchParams } = new URL(request.url);
//     const { month, year } = useMonthYear(searchParams);

//     // Early return demo data if user is demo
//     if (isDemoUser(session.user.id)) {
//       return NextResponse.json({
//         status: 'success',
//         message: 'Successfully retrieved roster',
//         data: dutyRoster,
//       });
//     }

//     const cookieStore = cookies();
//     const supabase = createClient(cookieStore);

//     const { data, error } = await supabase
//       .from('rosters')
//       .select(
//         `
//   duty_date,
//   is_extra,
//   duty_personnel(id, name),
//   reserve_duty_personnel (id, name)
// `
//       )
//       .eq('unit_id', session.user.app_metadata.unit_id)
//       .returns<RosterPatch[]>();

//     if (!data || error) {
//       return NextResponse.json({
//         status: 'error',
//         message: 'Failed to retrieve roster',
//       });
//     }

//     return NextResponse.json({
//       status: 'success',
//       message: 'Successfully retrieved roster',
//       data: data,
//     });
//   },
//   { allowDemoUser: true }
// );

export const POST = withAuth(
  async ({ request, group, client }) => {
    const { dutyDates, dutyPersonnels } = await request.json();

    if (!group.length) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User is not authorized',
        },
        { status: 401 }
      );
    }

    const roster: Tables<'rosters'>[] = dutyDates?.map((item: DutyDate) => ({
      ...(item.id && { id: item.id }),
      duty_date: item.date,
      is_extra: item.isExtra,
      duty_personnel_id: item.personnel?.id,
      reserve_duty_personnel_id: item.reservePersonnel?.id,
      group_id: group[0],
      updated_at: new Date().toISOString(),
    }));

    const personnels: Tables<'profiles'>[] = dutyPersonnels?.map(
      (item: Personnel) => ({
        id: item.id,
        name: item.name,
        weekday_points: item.weekdayPoints,
        weekend_points: item.weekendPoints,
        no_of_extras: item.extra,
        group_id: group[0], // Since profiles are unit specific, we can use the unit_id from the user
        updated_at: new Date().toISOString(),
      })
    );

    const { success: rosterSuccess } = DutyDateSchema.safeParse(roster);
    const { success: profilesSuccess } = PersonnelSchema.safeParse(personnels);

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
