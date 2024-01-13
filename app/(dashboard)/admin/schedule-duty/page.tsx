import { type Session } from '@supabase/supabase-js';
import {
  addDays,
  endOfMonth,
  format,
  isMatch,
  isWeekend,
  startOfMonth,
  subDays,
} from 'date-fns';
import { type Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { type RosterPatch } from '@/app/(dashboard)/api/roster/route';
import { GenerateDuty } from '@/components/generate-duty';
import { Icons } from '@/components/icons';
import { demoUsers, dutyRoster } from '@/lib/demo-data';
import { type DutyDate } from '@/lib/duty-roster';
import { isDemoUser } from '@/utils/demo';
import { indexOnceWithKey } from '@/utils/helper';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Schedule Duty',
  description: 'Admin page to schedule duty roster.',
};

const schema = z.date().optional();

async function getRoster(session: Session, month: string, year: string) {
  let monthDate = startOfMonth(new Date(`${month} ${year}`));
  const { success } = schema.safeParse(monthDate);

  monthDate = success ? monthDate : startOfMonth(new Date());

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let data: RosterPatch[] = dutyRoster;

  if (!isDemoUser(session.user.id)) {
    const { data: roster, error } = await supabase
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
      .eq('unit_id', session.user.app_metadata.unit_id)
      .returns<RosterPatch[]>();

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

async function getUsers(session: Session) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (isDemoUser(session.user.id)) {
    return demoUsers;
  }

  const { data: users, error } = await supabase
    .from('profiles')
    .select(
      'id, name, avatar_url, unit_id, blockout_dates, role, max_blockouts, weekday_points, weekend_points, enlistment_date, ord_date, no_of_extras'
    )
    .eq('unit_id', session.user.app_metadata.unit_id);

  if (!users || error) {
    throw new Error('Failed to fetch profile');
  }

  return users;
}

export default async function AdminScheduleDutyPage({
  searchParams,
}: {
  searchParams?: {
    month?: string;
    year?: string;
  };
}) {
  const today = new Date();
  const month =
    searchParams?.month && isMatch(searchParams.month, 'MMMM')
      ? searchParams.month
      : format(today, 'LLLL'); // December
  const year =
    searchParams?.year && isMatch(searchParams.year, 'yyyy')
      ? searchParams.year
      : today.getFullYear().toString();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const [roster, users] = await Promise.all([
    getRoster(session, month, year),
    getUsers(session),
  ]);

  return (
    <div className='space-y-4 p-8 pt-4'>
      <div className='flex w-full items-center space-y-2'>
        <Icons.edit className='mr-3 inline-block h-8 w-8 items-center align-middle' />
        <h1 className='grow scroll-m-20 border-b pb-2 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
          Schedule Duty
        </h1>
      </div>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        Generate the duty roster for the selected month & year with the given
        personnels. The algorithm uses &quot;points&quot; to determine the
        number of duty days. Personnel with lower &quot;points&quot; will have
        more duty.
      </p>
      <GenerateDuty roster={roster} users={users} month={month} year={year} />
    </div>
  );
}
