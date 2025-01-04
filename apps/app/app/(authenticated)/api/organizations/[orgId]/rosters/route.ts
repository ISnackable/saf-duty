import { NextResponse } from 'next/server';

import { withAuth } from '@/lib/auth/session';
import { getRostersByOrgId } from '@/lib/data';
import { useMonthYear } from '@/lib/helper';

export const GET = withAuth(
  async ({ searchParams, user }) => {
    const { month, year } = useMonthYear(searchParams);

    try {
      const roster = await getRostersByOrgId(user.organizationId, month, year);

      return NextResponse.json(
        {
          status: 'success',
          message: 'Successfully retrieved roster',
          data: roster,
        },
        { status: 200 }
      );
    } catch (_error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to retrieve roster',
        },
        { status: 500 }
      );
    }
  },
  { allowDemoUser: true }
);
