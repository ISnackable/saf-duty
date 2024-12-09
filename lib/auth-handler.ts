/* eslint-disable unused-imports/no-unused-vars */
// https://github.com/vercel/next.js/discussions/15286#discussioncomment-3831846
import 'server-only';

import type { User } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { limit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/clients/server';
import type { TypedSupabaseClient } from '@/lib/supabase/queries';
import type { State } from '@/types/api-route';
import type { Enums } from '@/types/supabase';
import { isDemoUser } from '@/utils/helper';

declare module '@supabase/supabase-js' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface UserAppMetadata {
    groups: Group;
  }
}
export interface Group {
  [id: string]: {
    name: string;
    role: Enums<'role'>;
  };
}

interface WithAuthHandler {
  ({
    request,
    params,
    searchParams,
    user,
    group,
  }: {
    request: Request;
    params: Record<string, string>;
    searchParams: URLSearchParams;
    client: TypedSupabaseClient;
    user: User;
    group: Group;
  }): Promise<NextResponse<State>>;
}

interface WithAuthOptions {
  requiredRole?: Enums<'role'>[];
  needNotExceededUsage?: boolean;
  allowDemoUser?: boolean;
}

export function withAuth(handler: WithAuthHandler, options?: WithAuthOptions) {
  const {
    requiredRole = ['user', 'admin'], // by default, all roles are allowed
    allowDemoUser = false, // special case for to allow a demo user (with session)
  } = options || {};

  return async (
    request: NextRequest,
    segmentData: { params: Promise<Record<string, string> | undefined> }
  ) => {
    const { searchParams } = new URL(request.url);
    const { method } = request;
    const params = await segmentData.params;

    // Rate limit only for POST, PUT, DELETE, PATCH
    if (
      method === 'POST' ||
      method === 'PUT' ||
      method === 'DELETE' ||
      method === 'PATCH'
    ) {
      const ip =
        request.headers.get('x-real-ip') ??
        request.headers.get('X-Forwarded-For') ??
        'unknown';
      const isRateLimited = limit(ip);

      if (isRateLimited) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Rate limit exceeded. Please try again later.',
          },
          { status: 429 }
        );
      }
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User is not authenticated',
        },
        { status: 401 }
      );
    }

    if (isDemoUser(user.id)) {
      if (allowDemoUser) {
        return handler({
          request,
          params: params || {},
          searchParams,
          client: supabase,
          user,
          group: {
            '1': {
              name: 'demo',
              role: 'user',
            },
          },
        });
      }

      return NextResponse.json(
        {
          status: 'error',
          message: 'Demo user is not authorized to perform this action',
        },
        { status: 401 }
      );
    }

    const userGroups = user?.app_metadata?.groups;
    const currentGroupId = Object.keys(userGroups)?.[0]; //TODO: handle multiple groups

    if (
      !requiredRole.some((role) => userGroups?.[currentGroupId]?.role === role)
    ) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User is not authorized',
        },
        { status: 401 }
      );
    }

    return handler({
      request,
      params: params || {},
      searchParams,
      client: supabase,
      user,
      group: user.app_metadata?.groups,
    });
  };
}
