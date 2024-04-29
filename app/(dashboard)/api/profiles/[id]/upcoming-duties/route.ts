import { NextResponse } from 'next/server';

import { withAuth } from '@/lib/auth-handler';
import { getUserUpcomingDutiesData } from '@/lib/supabase/data';

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

      const data = await getUserUpcomingDutiesData(client, user);

      return NextResponse.json(
        {
          status: 'success',
          message: 'Successfully retrieved upcoming duties',
          data: data,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to retrieve upcoming duties',
        },
        { status: 500 }
      );
    }
  },
  { allowDemoUser: true }
);
