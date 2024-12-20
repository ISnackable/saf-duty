import type { Session } from 'better-auth/types';
import { type NextRequest, NextResponse } from 'next/server';

const isProtectedRoute = (request: NextRequest) => {
  return request.url.startsWith('/dashboard'); // change this to your protected route
};

export async function authMiddleware(request: NextRequest) {
  const response = await fetch(
    `${request.nextUrl.origin}/api/auth/get-session`,
    {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    }
  );

  const session: Session | null = response.ok ? await response.json() : null;

  if (isProtectedRoute(request) || !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}
