import { auth, toNextJsHandler } from '@repo/auth/server';

export const runtime = 'edge';
export const maxDuration = 60;

export const { GET, POST } = toNextJsHandler(auth.handler);
