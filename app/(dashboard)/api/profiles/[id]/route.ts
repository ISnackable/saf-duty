import { formatISO } from 'date-fns';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAuth } from '@/lib/auth-handler';
import { getUserProfileData } from '@/lib/supabase/data';

const updateProfilesSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters',
    })
    .regex(
      /^[a-zA-Z\s]*$/,
      'Name must not include numbers or special characters'
    )
    .trim(),
  weekend_points: z.number().int().min(-100).max(100).optional(),
  weekday_points: z.number().int().min(-100).max(100).optional(),
  no_of_extras: z.number().int().min(0).max(100).optional(),
  avatar_url: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional(),
  ord_date: z
    .string()
    .pipe(z.coerce.date())
    .transform((date) => formatISO(date, { representation: 'date' }))
    .nullable()
    .optional(),
  blockout_dates: z
    .array(z.string().pipe(z.coerce.date()))
    .transform((date) =>
      date.map((d) => formatISO(d, { representation: 'date' }))
    )
    .optional(),
  onboarded: z.boolean().optional(),
  user_settings: z
    .object({
      notify_on_rosters_published: z.boolean(),
      notify_on_swap_requests: z.boolean(),
      notify_on_duty_reminder: z.boolean(),
    })
    .optional(),
});

export const GET = withAuth(
  async ({ params, client, user }) => {
    try {
      if (params.id !== user.id) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Unauthorized',
          },
          { status: 401 }
        );
      }

      const data = await getUserProfileData(client, user);

      return NextResponse.json(
        {
          status: 'success',
          message: 'Successfully retrieved profile',
          data: data,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to retrieve profile',
        },
        { status: 500 }
      );
    }
  },
  { allowDemoUser: true }
);

export const PATCH = withAuth(async ({ request, params, client, user }) => {
  try {
    const userRole = user.app_metadata?.groups?.role;

    // Only allow users with the role of 'admin' to update other users' profiles
    if (params.id !== user.id && userRole !== 'admin') {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const data = await request.json();
    const validatedFields = updateProfilesSchema.safeParse(data);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid fields provided',
        },
        { status: 400 }
      );
    }

    const { error } = await client
      .from('profiles')
      .update({ ...validatedFields.data, updated_at: new Date().toISOString() })
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to update profile',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Successfully updated profile',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update profile',
      },
      { status: 500 }
    );
  }
});
