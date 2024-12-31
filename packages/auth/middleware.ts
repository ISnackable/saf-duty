import 'server-only';

import { base64 } from '@better-auth/utils/base64';
import { binary } from '@better-auth/utils/binary';
import { createHMAC } from '@better-auth/utils/hmac';
import { betterFetch } from '@better-fetch/fetch';
import { env } from '@repo/env';
import { noseconeConfig, noseconeMiddleware } from '@repo/security/middleware';
import { site } from '@repo/site-config';
import { getCookie, getSignedCookie, parse } from 'better-call';
import type { NextRequest } from 'next/server';
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

const PREFIX = site.shortName.toLowerCase();
const SECRET = env.BETTER_AUTH_SECRET;
const SESSION_COOKIE_NAME = `${PREFIX}.session_token`;
const SESSION_DATA_COOKIE_NAME = `${PREFIX}.session_data`;
const securityHeaders = noseconeMiddleware(noseconeConfig);
const isProduction = !!process.env.VERCEL_ENV;

// Most of this code is from the better-auth package
// We implemented this to avoid making an extra request to the server
export async function getSession(
  request: NextRequest
): Promise<{ data: Session | null; response: Response }> {
  const response = await securityHeaders();

  try {
    const sessionCookieToken = await getSignedCookie(
      request.headers,
      SECRET,
      SESSION_COOKIE_NAME,
      isProduction ? 'secure' : undefined
    );

    if (!sessionCookieToken) {
      throw new Error('Invalid session token');
    }

    const sessionDataCookie = getCookie(
      request.headers.get('cookie') || '',
      SESSION_DATA_COOKIE_NAME,
      isProduction ? 'secure' : undefined
    );

    const sessionDataPayload = sessionDataCookie
      ? safeJSONParse<SessionDataPayload>(
          binary.decode(base64.decode(sessionDataCookie))
        )
      : null;

    if (sessionDataPayload) {
      const isValid = await createHMAC('SHA-256', 'base64urlnopad').verify(
        SECRET,
        JSON.stringify(sessionDataPayload.session),
        sessionDataPayload.signature
      );

      if (!isValid) {
        throw new Error('Invalid session data');
      }
    }

    if (sessionDataPayload?.session) {
      const session = sessionDataPayload.session;
      const hasExpired =
        sessionDataPayload.expiresAt < Date.now() ||
        new Date(session.session.expiresAt) < new Date();

      if (!hasExpired) {
        return { data: session, response };
      }
    }

    // Stale session, fetch the latest session
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
            const [name, value] = Object.entries(parse(cookie))[0];
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
