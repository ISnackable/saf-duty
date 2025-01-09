import { NextResponse } from 'next/server';

import { withAuth } from '@/lib/auth/session';
import { getProfilesByOrgId } from '@/lib/data';

export const runtime = 'edge';

export const GET = withAuth(
  async ({ user }) => {
    try {
      const data = await getProfilesByOrgId(user.organizationId);

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
