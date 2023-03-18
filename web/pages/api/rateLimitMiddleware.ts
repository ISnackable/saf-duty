import type { Middleware } from 'next-api-route-middleware'

import rateLimit from '@/utils/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

export const rateLimitMiddleware: Middleware = async (_req, res, next) => {
  try {
    await limiter.check(res, 10, 'CACHE_TOKEN') // 10 requests per minute
    return await next()
  } catch {
    res.status(429).json({ status: 'error', message: 'Rate limit exceeded' })
  }
}
