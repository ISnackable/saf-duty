import { NextResponse } from 'next/server';

import { withAuth } from '@/lib/auth-handler';
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
    } catch (_error) {
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
