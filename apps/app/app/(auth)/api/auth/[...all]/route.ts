import { auth, toNextJsHandler } from '@repo/auth/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const { GET: GET_HANDLER, POST: POST_HANDLER } = toNextJsHandler(auth.handler);

export async function GET(request: NextRequest) {
  return await GET_HANDLER(request);
}

export async function POST(request: NextRequest) {
  return await POST_HANDLER(request);
}
