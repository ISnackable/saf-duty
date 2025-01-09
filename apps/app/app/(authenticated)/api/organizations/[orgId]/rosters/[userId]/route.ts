import { NextResponse } from 'next/server';

import { withAuth } from '@/lib/auth/session';
import { getRostersByUserId } from '@/lib/data';

export const runtime = 'edge';

export const GET = withAuth(
  async ({ params, user }) => {
    try {
      if (params.userId !== user.id) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Unauthorized',
          },
          { status: 401 }
        );
      }

      const data = await getRostersByUserId(user.organizationId, user.id);

      return NextResponse.json(
        {
          status: 'success',
          message: 'Successfully retrieved upcoming duties',
          data: data,
        },
        { status: 200 }
      );
    } catch (_error) {
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
