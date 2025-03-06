import 'server-only';

import { base64 } from '@better-auth/utils/base64';
import { binary } from '@better-auth/utils/binary';
import { createHMAC } from '@better-auth/utils/hmac';
import { betterFetch } from '@better-fetch/fetch';
import {
  noseconeMiddleware,
  noseconeOptions,
  noseconeOptionsWithToolbar,
} from '@repo/security/middleware';
import { site } from '@repo/site-config';
import type { NextRequest } from 'next/server';
import { keys } from './keys';
import { getCookie, getSignedCookie, parseCookies } from './lib/cookies';
import type { Session } from './types';

type SessionDataPayload = {
  session: Session;
  signature: string;
  expiresAt: number;
};

export function safeJSONParse<T>(data: string): T | null {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

const isProduction = !!process.env.VERCEL_ENV;
const PREFIX = site.shortName.toLowerCase();
const SECRET = keys().BETTER_AUTH_SECRET;
const SESSION_COOKIE_NAME = `${PREFIX}.session_token`;
const SESSION_DATA_COOKIE_NAME = `${PREFIX}.session_data`;
const securityHeaders = keys().FLAGS_SECRET
  ? noseconeMiddleware(noseconeOptionsWithToolbar)
  : noseconeMiddleware(noseconeOptions);

// Most of this code is from the better-auth package
// We implemented this to avoid making an extra request to the server
export async function getSession(
  request: NextRequest
): Promise<{ data: Session | null; response: Response }> {
  const response = await securityHeaders();

  try {
    const sessionCookieToken = await getSignedCookie(
      request.headers,
      SESSION_COOKIE_NAME,
      SECRET,
      isProduction ? 'secure' : undefined
    );

    // This guarantees that the session token is valid
    if (!sessionCookieToken) {
      throw new Error('Invalid session token');
    }

    // Attempt to fetch the cached session data
    const sessionDataCookie = getCookie(
      request.headers,
      SESSION_DATA_COOKIE_NAME,
      isProduction ? 'secure' : undefined
    );

    const sessionDataPayload = sessionDataCookie
      ? safeJSONParse<SessionDataPayload>(
          binary.decode(base64.decode(sessionDataCookie))
        )
      : null;

    if (sessionDataPayload) {
      // Make sure the session data is valid by verifying the signature
      const isValid = await createHMAC('SHA-256', 'base64urlnopad').verify(
        SECRET,
        JSON.stringify({
          ...sessionDataPayload.session,
          expiresAt: sessionDataPayload.expiresAt,
        }),
        sessionDataPayload.signature
      );

      // Tampered session data, instead of fetching the session, we invalidate the session data
      if (!isValid) {
        throw new Error('Invalid session data');
      }

      if (sessionDataPayload.session) {
        const session = sessionDataPayload.session;
        const hasExpired =
          sessionDataPayload.expiresAt < Date.now() ||
          new Date(session.session.expiresAt) < new Date();

        if (!hasExpired) {
          return { data: session, response };
        }
      }
    }

    // Stale session or malformed session data, fetch the latest session
    const { data: session } = await betterFetch<Session>(
      '/api/auth/get-session',
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
        onResponse: (responseContext) => {
          // Set cookies from the session response
          const cookiesToSet = responseContext?.response.headers.getSetCookie();
          // Just to be safe, we set the cookies in the request headers
          cookiesToSet?.forEach((cookie) => {
            const [[name, value]] = parseCookies(cookie);
            request.headers.set(name, value);
          });
          cookiesToSet?.forEach((cookie) =>
            response.headers.append('Set-Cookie', cookie)
          );
        },
      }
    );

    if (!session) {
      throw new Error('Error fetching session');
    }

    return { data: session, response };
  } catch (_error) {
    return { data: null, response };
  }
}
