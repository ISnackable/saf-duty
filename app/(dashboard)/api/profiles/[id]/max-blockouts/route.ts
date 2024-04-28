import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAuth } from '@/lib/auth-handler';

const updateMaxBlockoutsSchema = z.object({
  max_blockouts: z.number().int().min(0).max(100),
});

export const PATCH = withAuth(
  async ({ request, params, client }) => {
    try {
      const data = await request.json();
      const validatedFields = updateMaxBlockoutsSchema.safeParse(data);

      if (!validatedFields.success) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Invalid fields provided',
          },
          { status: 400 }
        );
      }

      const { error } = await client
        .from('profiles')
        .update(validatedFields.data)
        .eq('id', params.id);

      if (error) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Failed to update user max blockouts',
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          status: 'success',
          message: 'Successfully updated max blockouts',
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to update user max blockouts',
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: ['admin'] }
);
