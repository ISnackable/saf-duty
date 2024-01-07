/* eslint-disable unused-imports/no-unused-vars */
// https://github.com/vercel/next.js/discussions/15286#discussioncomment-3831846
import { type Session } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { type State } from '@/types/api-route';
import { getSearchParams } from '@/utils/get-search-params';
import { createClient } from '@/utils/supabase/server';

interface WithAuthHandler {
  ({
    request,
    params,
    searchParams,
    headers,
    session,
  }: {
    request: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    headers?: Record<string, string>;
    session: Session;
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
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User is not authenticated',
        },
        { status: 401 }
      );
    }

    // TODO: Chane back to allowAnonymous instead of allowDemoUser, we will instead use a demo user that has no session and just use middleware to check for that if a certain demo cookie is set
    if (session.user.email === 'demo@example.com') {
      if (allowDemoUser) {
        return handler({
          request,
          params: params || {},
          searchParams,
          headers,
          session,
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

    if (!requiredRole.includes(session.user.app_metadata?.role)) {
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
      session,
    });
  };
}

interface WithSessionHandler<T extends boolean> {
  ({
    request,
    params,
    searchParams,
    session,
  }: {
    request: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    session: T extends true ? null : Session;
  }): Promise<NextResponse<State>>;
}

interface WithSessionOptions<T extends boolean> {
  allowAnonymous?: T;
}

export function withSession<T extends boolean = false>(
  handler: WithSessionHandler<T>,
  options?: WithSessionOptions<T>
) {
  const {
    allowAnonymous = false as T, // special case for completely anonymous user
  } = options || {};

  return async (
    request: Request,
    { params }: { params: Record<string, string> }
  ) => {
    const searchParams = getSearchParams(request.url);
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    if (allowAnonymous) {
      return handler({
        request,
        params: params || {},
        searchParams,
        session: null as T extends true ? null : Session,
      });
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User is not authenticated',
        },
        { status: 401 }
      );
    }

    return handler({
      request,
      params,
      searchParams,
      session: session as T extends true ? null : Session,
    });
  };
}
