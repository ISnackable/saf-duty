import { createAuthClient } from 'better-auth/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const { getSession } = createAuthClient();

const isProtectedRoute = (request: NextRequest) => {
  return request.url.startsWith('/dashboard'); // change this to your protected route
};

export default async function authMiddleware(request: NextRequest) {
  const session = await getSession(request);

  if (isProtectedRoute(request) && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}
