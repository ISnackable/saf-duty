import { keys as flags } from '@repo/feature-flags/keys';
import { keys as rateLimit } from '@repo/rate-limit/keys';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    extends: [flags(), rateLimit()],
    server: {
      BETTER_AUTH_SECRET: z.string().min(1),
    },
    client: {},
    runtimeEnv: {
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    },
  });
