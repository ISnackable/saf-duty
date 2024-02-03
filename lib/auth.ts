/* eslint-disable unused-imports/no-unused-vars */
// https://github.com/vercel/next.js/discussions/15286#discussioncomment-3831846
import 'server-only';

import { type User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { type State } from '@/types/api-route';
import { isDemoUser } from '@/utils/demo';
import { getSearchParams } from '@/utils/get-search-params';
import { createClient } from '@/utils/supabase/actions';

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
    searchParams: Record<string, string>;
    headers?: Record<string, string>;
    user: User;
    group: string[];
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
    const searchParams = getSearchParams(request.url);
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
          user,
          group: [],
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
      !requiredRole.some((role) =>
        Object.values(user.app_metadata?.groups).flat().includes(role)
      )
    ) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User is not authorized',
        },
        { status: 401 }
      );
    }

    let matchingGroups = Object.keys(user.app_metadata?.groups).filter(
      (groupId) => {
        return user.app_metadata?.groups[groupId].some(
          (role: 'user' | 'admin' | 'manager') => requiredRole.includes(role)
        );
      }
    );

    return handler({
      request,
      params: params || {},
      searchParams,
      headers,
      user,
      group: matchingGroups,
    });
  };
}
