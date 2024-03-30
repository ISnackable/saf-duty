import { NextResponse } from 'next/server';

import { withAuth } from '@/lib/auth';
import { getUsersProfileData } from '@/lib/supabase/data';

export const GET = withAuth(
  async ({ client, user }) => {
    try {
      const data = await getUsersProfileData(client, user);

      return NextResponse.json(
        {
          status: 'success',
          message: 'Successfully retrieved profiles',
          data: data,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to retrieve profiles',
        },
        { status: 500 }
      );
    }
  },
  { allowDemoUser: true }
);
