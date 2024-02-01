import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAuth } from '@/lib/auth';
import { Tables } from '@/types/supabase';
import { createClient } from '@/utils/supabase/actions';

const dateSchema = z.array(z.coerce.date());

export const PUT = withAuth(async ({ request, user }) => {
  const {
    blockout_dates,
  }: { blockout_dates: Tables<'profiles'>['blockout_dates'] } =
    await request.json();

  // TODO: Suppose to also validate the max length of blockout_dates for each month :)
  const { success } = dateSchema.safeParse(blockout_dates);
  if (!success) {
    return NextResponse.json({
      status: 'error',
      message: 'Invalid blockout dates',
    });
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from('profiles')
    .update({
      blockout_dates,
    })
    .eq('id', user.id);

  if (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update blockout dates',
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: 'success',
    message: 'Successfully updated blockout dates',
  });
});
