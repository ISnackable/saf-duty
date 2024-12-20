import { betterFetch } from '@better-fetch/fetch';
import type { Session } from '@repo/auth/types';
import { noseconeConfig, noseconeMiddleware } from '@repo/security/middleware';

const securityHeaders = noseconeMiddleware(noseconeConfig);

import { type NextRequest, NextResponse } from 'next/server';

// Public paths that do not require authentication, /change-password SHOULD be accessible only to authenticated users.
const PUBLIC_PATHS = ['/register', '/login', '/reset-password'];

function redirectToPath(request: NextRequest, path = '/') {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = '';
  return NextResponse.redirect(url);
}

function redirectToLogin(request: NextRequest) {
  if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
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
        //get the cookie from the request
        cookie: request.headers.get('cookie') || '',
      },
    }
  );

  if (!session) {
    return redirectToLogin(request);
  }

  if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
    // Authenticated user should not be able to access /login, /register and /reset-password routes
    const redirectSearchParams = request.nextUrl.searchParams.get('redirect');

    if (redirectSearchParams) {
      return redirectToPath(request, redirectSearchParams);
    }

    return redirectToPath(request);
  }

  return securityHeaders();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
