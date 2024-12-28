/* eslint-disable unused-imports/no-unused-vars */
// https://github.com/vercel/next.js/discussions/15286#discussioncomment-3831846
import 'server-only';

import { type NextRequest, NextResponse } from 'next/server';

import { isDemoUser } from '@repo/auth/lib/utils';
import { auth } from '@repo/auth/server';
import type { Session } from '@repo/auth/types';
import { ratelimit } from '@repo/rate-limit';
import { headers as nextHeaders } from 'next/headers';

type WithAdminHandler = ({
  request,
  params,
  searchParams,
  headers,
  user,
}: {
  request: Request;
  params: Record<string, string>;
  searchParams: URLSearchParams;
  headers: Headers;
  user: Session;
}) => Promise<NextResponse>;

interface WithAuthOptions {
  needNotExceededUsage?: boolean;
  allowDemoUser?: boolean;
}

// This is a middleware to check if the user is an admin, it is different from organization admin
// The admin here is the super admin of the application
export function withAdmin(
  handler: WithAdminHandler,
  options?: WithAuthOptions
) {
  const {
    allowDemoUser = false, // special case for to allow a demo user (with session)
  } = options || {};

  return async (
    request: NextRequest,
    segmentData: { params: Promise<Record<string, string> | undefined> }
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
  ) => {
    const { searchParams } = new URL(request.url);
    const headers = await nextHeaders();
    const { method } = request;
    const params = await segmentData.params;

    // Rate limit only for POST, PUT, DELETE, PATCH
    if (
      ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) &&
      !options?.needNotExceededUsage
    ) {
      const ip =
        headers.get('x-real-ip') ?? headers.get('X-Forwarded-For') ?? 'unknown';
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Rate limit exceeded. Please try again later.',
          },
          {
            status: 429,
            headers: new Headers({
              'Retry-After': reset.toString(),
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            }),
          }
        );
      }
    }

    const session = await auth.api.getSession({
      headers,
    });

    if (!session) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User is not authenticated',
        },
        { status: 401 }
      );
    }

    if (isDemoUser(session.user.id)) {
      if (allowDemoUser) {
        return handler({
          request,
          params: params || {},
          searchParams,
          headers,
          user: session,
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

    if (session.user.role !== 'admin') {
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
      user: session,
    });
  };
}
