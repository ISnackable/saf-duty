import { isDemoUser } from '@repo/auth/lib/utils';
import { getSession } from '@repo/auth/middleware';
import {
  noseconeMiddleware,
  noseconeOptions,
  noseconeOptionsWithToolbar,
} from '@repo/security/middleware';
import { trustedOrigins } from '@repo/site-config';
import { type NextRequest, NextResponse } from 'next/server';
import { env } from './env';

const securityHeaders = env.FLAGS_SECRET
  ? noseconeMiddleware(noseconeOptionsWithToolbar)
  : noseconeMiddleware(noseconeOptions);

// Public paths that do not require authentication, /change-password SHOULD be accessible only to authenticated users.
const PUBLIC_AUTH_PATHS = ['/register', '/login', '/reset-password'];
const PUBLIC_PATHS = [...PUBLIC_AUTH_PATHS, '/privacy', '/terms', '/faq'];
const corsOptions = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function setCorsHeaders(request: NextRequest) {
  // Check the origin from the request
  const origin = request.nextUrl.origin ?? '';
  const isAllowedOrigin = trustedOrigins.includes(origin);

  // Handle preflighted requests
  const isPreflight = request.method === 'OPTIONS';

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Handle simple requests
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

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
  if (request.nextUrl.pathname.startsWith('/api')) {
    return setCorsHeaders(request);
  }

  const { data: session, response } = await getSession(request);

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

  // Authenticated user should not be able to access /organization routes if not an privileged role (unless it's a demo user)
  if (
    request.nextUrl.pathname.startsWith('/organization') &&
    !isDemoUser(session.user.id)
  ) {
    const res = await fetch(
      new URL(
        '/api/auth/organization/get-active-member',
        request.nextUrl.origin
      ),
      {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      }
    );
    const member = res.ok ? await res.json() : null;

    if (['owner', 'admin'].includes(member?.role)) {
      return response;
    }

    return redirectToPath(request);
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
