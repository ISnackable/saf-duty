import { NextResponse } from 'next/server';

import { withAuth } from '@/lib/auth-handler';
import { getUserSwapRequestData } from '@/lib/supabase/data';

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
