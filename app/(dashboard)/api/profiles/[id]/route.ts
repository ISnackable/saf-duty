import { NextResponse } from 'next/server';

import { withAuth } from '@/lib/auth';
import { getUserProfileData } from '@/lib/supabase/data';

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
