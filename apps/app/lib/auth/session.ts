/* eslint-disable unused-imports/no-unused-vars */
// https://github.com/vercel/next.js/discussions/15286#discussioncomment-3831846
import 'server-only';

import { type NextRequest, NextResponse } from 'next/server';

import { isDemoUser } from '@repo/auth/lib/utils';
import { auth } from '@repo/auth/server';
import type { ActiveMember, Roles } from '@repo/auth/types';
import { createRateLimiter } from '@repo/rate-limit';
import { headers as nextHeaders } from 'next/headers';
import { env } from '../../env';

type WithAuthHandler = ({
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
  user: ActiveMember;
}) => Promise<NextResponse>;

interface WithAuthOptions {
  requiredRole?: Roles;
  needNotExceededUsage?: boolean;
  allowDemoUser?: boolean;
}

// This is a middleware to check if the organization user is authenticated and has the required role
export function withAuth(handler: WithAuthHandler, options?: WithAuthOptions) {
  const {
    requiredRole = ['owner', 'admin', 'member'], // by default, all roles are required
    allowDemoUser = false, // special case for to allow a demo user (with session)
  } = options || {};

  return async (
    request: NextRequest,
    segmentData: { params: Promise<Record<string, string> | undefined> }
  ) => {
    const { searchParams } = new URL(request.url);
    const headers = await nextHeaders();
    const { method } = request;
    const params = await segmentData.params;

    // Rate limit only for POST, PUT, DELETE, PATCH
    if (
      ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) &&
      !options?.needNotExceededUsage &&
      env.UPSTASH_REDIS_REST_URL &&
      env.UPSTASH_REDIS_REST_TOKEN
    ) {
      const rateLimiter = createRateLimiter();
      const ip =
        headers.get('x-real-ip') ?? headers.get('X-Forwarded-For') ?? 'unknown';
      const { success, limit, reset, remaining } = await rateLimiter.limit(ip);

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

    const member = await auth.api.getActiveMember({
      headers,
    });

    if (!member) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User is not authenticated',
        },
        { status: 401 }
      );
    }

    if (isDemoUser(member.user.id)) {
      if (allowDemoUser) {
        return handler({
          request,
          params: params || {},
          searchParams,
          headers,
          user: member,
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

    if (!requiredRole.some((role) => member.role === role)) {
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
      user: member,
    });
  };
}
