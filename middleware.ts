import { addMinutes, isPast } from 'date-fns';
import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/middleware';

import { isDemoUser } from './utils/demo';

// Public paths that do not require authentication, /change-password SHOULD be accessible only to authenticated users.
const PUBLIC_PATHS = ['/register', '/login', '/reset-password'];

function redirectToHome(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/';
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
  try {
    // This `try/catch` block is only here for the interactive tutorial.
    // Feel free to remove once you have Supabase connected.
    const { supabase, response } = createClient(request);

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return redirectToLogin(request);
    }

    // Authenticated user should not be able to access /login, /register and /reset-password routes
    if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
      return redirectToHome(request);
    }

    // Authenticated user should not be able to access /change-password route unless they have requested a password reset
    if (request.nextUrl.pathname === '/change-password') {
      if (
        !session.user?.recovery_sent_at ||
        // Check if the password reset request is expired, with a 5 minute buffer
        (session.user.recovery_sent_at &&
          isPast(addMinutes(session.user.recovery_sent_at, 5)))
      ) {
        return redirectToHome(request);
      }
    }

    // Authenticated user should not be able to access /admin routes if not an "admin" role (unless it's a demo user)
    if (request.nextUrl.pathname.startsWith('/admin')) {
      // The server gets the user session from the cookies, which can be spoofed by anyone.
      // It's safe to trust `getUser()` because it sends a request to the Supabase Auth server every time to revalidate the Auth token.
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // user here shouldn't be null, as we've already checked for session above
      if (user?.app_metadata?.role !== 'admin' && !isDemoUser(user?.id!)) {
        return redirectToHome(request);
      }
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
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
