/* eslint-disable unused-imports/no-unused-vars */
// https://github.com/vercel/next.js/discussions/15286#discussioncomment-3831846
import 'server-only';

import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/clients/server';
import { type TypedSupabaseClient } from '@/lib/supabase/queries';
import { type State } from '@/types/api-route';
import { isDemoUser } from '@/utils/helper';

declare module '@supabase/supabase-js' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface UserAppMetadata {
    groups: Group;
  }
}
export interface Group {
  id: string;
  role: 'admin' | 'manager' | 'user';
}

interface WithAuthHandler {
  ({
    request,
    params,
    searchParams,
    headers,
    user,
    group,
  }: {
    request: Request;
    params: Record<string, string>;
    searchParams: URLSearchParams;
    headers?: Record<string, string>;
    client: TypedSupabaseClient;
    user: User;
    group: Group;
  }): Promise<NextResponse<State>>;
}

interface WithAuthOptions {
  requiredRole?: Array<'admin' | 'manager' | 'user'>;
  needNotExceededUsage?: boolean;
  allowDemoUser?: boolean;
}

export function withAuth(handler: WithAuthHandler, options?: WithAuthOptions) {
  const {
    requiredRole = ['user', 'admin'], // by default, all roles are allowed
    allowDemoUser = false, // special case for to allow a demo user (with session)
  } = options || {};

  return async (
    request: Request,
    { params }: { params: Record<string, string> | undefined }
  ) => {
    const { searchParams } = new URL(request.url);
    let headers = {};

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
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
          headers,
          client: supabase,
          user,
          group: {
            id: 'demo',
            role: 'user',
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

    if (
      !requiredRole.some((role) => user.app_metadata?.groups?.role === role)
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
      headers,
      client: supabase,
      user,
      group: user.app_metadata?.groups,
    });
  };
}
