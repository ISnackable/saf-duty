import { NextResponse } from 'next/server';

import { withAuth } from '@/lib/auth-handler';
import { getUserSwapRequestData } from '@/lib/supabase/data';

export const GET = withAuth(
  async ({ client, user }) => {
    try {
      const data = await getUserSwapRequestData(client, user);

      return NextResponse.json(
        {
          status: 'success',
          message: 'Successfully retrieved swap requests',
          data: data,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to retrieve swap requests',
        },
        { status: 500 }
      );
    }
  },
  { allowDemoUser: true }
);
