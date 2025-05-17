import 'server-only';

import { redis } from '@repo/rate-limit';
import type { SecondaryStorage } from 'better-auth/types';
import { keys } from '../keys';

export const createSecondaryStorage = () => {
  if (!keys().UPSTASH_REDIS_REST_URL || !keys().UPSTASH_REDIS_REST_TOKEN) {
    return undefined;
  }

  return {
    get: async (key) => {
      const value = (await redis.get(key)) as string | null;
      return value ? JSON.parse(JSON.stringify(value)) : null;
    },
    set: async (key, value, ttl) => {
      if (ttl) {
        await redis.set(key, JSON.stringify(value), { ex: ttl });
      } else {
        await redis.set(key, JSON.stringify(value));
      }
    },
    delete: async (key) => {
      await redis.del(key);
    },
  } as SecondaryStorage;
};
