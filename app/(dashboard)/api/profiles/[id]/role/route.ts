import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAuth } from '@/lib/auth-handler';

const updateRoleSchema = z.object({
  role: z.enum(['admin', 'manager', 'user']),
});

export const PATCH = withAuth(
  async ({ request, params, client, user }) => {
    try {
      // User is not allowed to update their own role
      if (user.id === params.id) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'You are not allowed to update your own role',
          },
          { status: 403 }
        );
      }

      const data = await request.json();
      const validatedFields = updateRoleSchema.safeParse(data);

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
        .from('group_users')
        .update(validatedFields.data)
        .eq('user_id', params.id);

      if (error) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Failed to update user role',
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          status: 'success',
          message: 'Successfully updated user role',
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to update user role',
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: ['admin'] }
);
