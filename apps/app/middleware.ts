import { betterFetch } from '@better-fetch/fetch';
import { isDemoUser } from '@repo/auth/lib/utils';
import type { Member, Session } from '@repo/auth/types';
import { noseconeConfig, noseconeMiddleware } from '@repo/security/middleware';

const securityHeaders = noseconeMiddleware(noseconeConfig);

import { type NextRequest, NextResponse } from 'next/server';

// Public paths that do not require authentication, /change-password SHOULD be accessible only to authenticated users.
const PUBLIC_AUTH_PATHS = ['/register', '/login', '/reset-password'];
const PUBLIC_PATHS = [...PUBLIC_AUTH_PATHS, '/privacy', '/terms', '/faq'];

function redirectToPath(request: NextRequest, path = '/') {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = '';
  return NextResponse.redirect(url);
}

function redirectToLogin(request: NextRequest) {
  if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
    return securityHeaders();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.search = `redirect=${request.nextUrl.pathname}${url.search}`;
  return NextResponse.redirect(url);
}

export default async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    }
  );

  if (!session) {
    return redirectToLogin(request);
  }

  if (PUBLIC_AUTH_PATHS.includes(request.nextUrl.pathname)) {
    // Authenticated user should not be able to access /login, /register and /reset-password routes
    const redirectSearchParams = request.nextUrl.searchParams.get('redirect');

    if (redirectSearchParams) {
      return redirectToPath(request, redirectSearchParams);
    }

    // Redirect to home page if user is already authenticated
    return redirectToPath(request);
  }

  // Authenticated user should not be able to access /admin routes if not an "admin" role (unless it's a demo user)
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    session.user.role !== 'admin' &&
    !isDemoUser(session.user.id)
  ) {
    return redirectToPath(request);
  }

  //TODO: Finally, we check whether the user has an active organization, else we redirect them to the onboarding page
  if (!session.session.activeOrganizationId) {
    return redirectToPath(request, '/onboarding');
  }

  if (request.nextUrl.pathname.startsWith('/organization')) {
    const { data: member } = await betterFetch<Member>(
      '/api/auth/organization/get-active-member',
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      }
    );

    if (!member) {
      return redirectToPath(request, '/onboarding');
    }

    if (['owner', 'admin'].includes(member.role)) {
      return securityHeaders();
    }

    return redirectToPath(request);
  }

  return securityHeaders();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/reset-password',
    '/change-password',
    '/duty-personnels',
    '/duty-roster',
    '/manage-blockouts',
    '/swap-duties',
    '/settings/:path*',
    '/admin/:path*',
    '/collections/:path*',
    // '/onboarding',
    // '/organization/:path*',
  ],
};
