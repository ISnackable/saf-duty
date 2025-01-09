import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAuth } from '@/lib/auth/session';

export const runtime = 'edge';

const updateMaxBlockoutsSchema = z.object({
  max_blockouts: z.number().int().min(0).max(31),
});

export const PATCH = withAuth(
  async ({ request, params }) => {
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

      //   const { error } = await client
      //     .from('profiles')
      //     .update(validatedFields.data)
      //     .eq('id', params.userId);

      //   if (error) {
      //     return NextResponse.json(
      //       {
      //         status: 'error',
      //         message: 'Failed to update user max blockouts',
      //       },
      //       { status: 500 }
      //     );
      //   }

      return NextResponse.json(
        {
          status: 'success',
          message: 'Successfully updated max blockouts',
        },
        { status: 200 }
      );
    } catch (_error) {
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
