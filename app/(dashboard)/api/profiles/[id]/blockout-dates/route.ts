import { NextResponse } from 'next/server';

import { withAuth } from '@/lib/auth';

export const POST = withAuth(
  async ({ request, params, client, user }) => {
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

      const { blockoutDates } = await request.json();

      const { error } = await client
        .from('profiles')
        .update({ blockout_dates: blockoutDates })
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
    } catch (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Something went wrong',
        },
        { status: 500 }
      );
    }
  },
  { allowDemoUser: true }
);
