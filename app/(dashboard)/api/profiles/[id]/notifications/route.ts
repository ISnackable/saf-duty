import { NextResponse } from 'next/server';

import { withAuth } from '@/lib/auth-handler';
import { getUserNotificationData } from '@/lib/supabase/data';

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

      const { count, data } = await getUserNotificationData(client, user);

      return NextResponse.json(
        {
          status: 'success',
          message: 'Successfully retrieved notifications',
          data: { notifications: data, unreadCount: count },
        },
        { status: 200 }
      );
    } catch (_error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to retrieve notifications',
        },
        { status: 500 }
      );
    }
  },
  { allowDemoUser: true }
);

export const DELETE = withAuth(async ({ request, params, client, user }) => {
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

    const { id } = await request.json();

    const { error } = await client.from('notifications').delete().eq('id', id);

    if (error) {
      console.error(error);
      throw new Error('Failed to delete notification');
    }

    // const { count } = await client
    //   .from('notifications')
    //   .select('*', { count: 'estimated', head: true });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Successfully deleted notification',
        // data: { unreadCount: count },
      },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to delete notifications',
      },
      { status: 500 }
    );
  }
});

export const PATCH = withAuth(async ({ request, params, client, user }) => {
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

    const { id, read } = await request.json();

    const { error } = await client
      .from('notifications')
      .update({ is_read: read })
      .eq('id', id);

    if (error) {
      console.error(error);
      throw new Error('Failed to update notification');
    }

    // const { count } = await client
    //   .from('notifications')
    //   .select('*', { count: 'estimated', head: true });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Successfully updated notification',
        // data: { unreadCount: count },
      },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update notifications',
      },
      { status: 500 }
    );
  }
});
