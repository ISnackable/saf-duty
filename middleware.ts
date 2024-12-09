import { addMinutes, isPast } from 'date-fns';
import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/clients/middleware';
import { isDemoUser } from '@/utils/helper';

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

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  //! We're using `getSession()` here to check if the user is logged in despite the fact that it can be spoofed.
  //* We'll use `getUser()` later to get the user data securely for /admin routes.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirectToLogin(request);
  }

  // Authenticated user should not be able to access /login, /register and /reset-password routes
  if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
    const redirectSearchParams = request.nextUrl.searchParams.get('redirect');

    if (redirectSearchParams) {
      return redirectToPath(request, redirectSearchParams);
    }

    return redirectToPath(request);
  }

  // Authenticated user should not be able to access /change-password route unless they have requested a password reset
  if (request.nextUrl.pathname === '/change-password') {
    if (
      !session.user?.recovery_sent_at ||
      // Check if the password reset request is expired, with a 5 minute buffer
      (session.user.recovery_sent_at &&
        isPast(addMinutes(session.user.recovery_sent_at, 5)))
    ) {
      return redirectToPath(request);
    }
  }
  // Authenticated user should not be able to access /admin routes if not an "admin" role (unless it's a demo user)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    //! The server gets the user session from the cookies, which can be spoofed by anyone.
    //* It's safe to trust `getUser()` because it sends a request to the Supabase Auth server every time to revalidate the Auth token.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userGroups = session.user?.app_metadata?.groups;
    const currentGroupId = Object.keys(userGroups)?.[0]; //TODO: handle multiple groups

    // user here shouldn't be null, as we've already checked for session above
    if (
      userGroups?.[currentGroupId]?.role !== 'admin' &&
      !isDemoUser(user?.id!)
    ) {
      return redirectToPath(request);
    }
  }

  return response;
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
  ],
};
