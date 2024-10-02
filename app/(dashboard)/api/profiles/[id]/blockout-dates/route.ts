import { formatISO } from 'date-fns';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAuth } from '@/lib/auth-handler';

const manageBlockoutSchema = z.object({
  blockout_dates: z
    .array(z.string().pipe(z.coerce.date()))
    .transform((date) =>
      date.map((d) => formatISO(d, { representation: 'date' }))
    ),
});

export const POST = withAuth(async ({ request, params, client, user }) => {
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

    const data = await request.json();
    const validatedFields = manageBlockoutSchema.safeParse(data);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid blockout dates provided',
        },
        { status: 400 }
      );
    }

    const { error } = await client
      .from('profiles')
      .update(validatedFields.data)
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

    return NextResponse.json(
      {
        status: 'success',
        message: 'Successfully updated blockout dates',
      },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Something went wrong',
      },
      { status: 500 }
    );
  }
});
