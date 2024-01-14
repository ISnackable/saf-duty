import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// import { useMonthYear } from '@/hooks/use-month-year';
import { withAuth } from '@/lib/auth';
// import { dutyRoster } from '@/lib/demo-data';
import { type DutyDate, type Personnel } from '@/lib/duty-roster';
import { type Tables } from '@/types/supabase';
// import { isDemoUser } from '@/utils/demo';
import { createClient } from '@/utils/supabase/server';

export interface RosterPatch
  extends Pick<Tables<'roster'>, 'id' | 'duty_date' | 'is_extra'> {
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
//       .from('roster')
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
  async ({ request, session }) => {
    const { dutyDates, dutyPersonnels } = await request.json();

    const roster: Tables<'roster'> = dutyDates?.map((item: DutyDate) => ({
      ...(item.id && { id: item.id }),
      duty_date: item.date,
      is_extra: item.isExtra,
      duty_personnel: item.personnel?.id,
      reserve_duty_personnel: item.reservePersonnel?.id,
      unit_id: session.user.app_metadata.unit_id,
      updated_at: new Date().toISOString(),
    }));

    const personnels: Tables<'profiles'> = dutyPersonnels?.map(
      (item: Personnel) => ({
        id: item.id,
        name: item.name,
        weekday_points: item.weekdayPoints,
        weekend_points: item.weekendPoints,
        no_of_extras: item.extra,
        unit_id: session.user.app_metadata.unit_id, // Since profiles are unit specific, we can use the unit_id from the session
        updated_at: new Date().toISOString(),
      })
    );

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const upsertRosterQuery = supabase
      .from('roster')
      .upsert(roster, { onConflict: 'duty_date' })
      .select();

    const upsertProfilesQuery = supabase
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
