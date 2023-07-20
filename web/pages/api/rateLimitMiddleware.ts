import type { Middleware } from 'next-api-route-middleware'

import rateLimit from '@/utils/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 30, // Max 30 users per second
})

export const rateLimitMiddleware: Middleware = async (_req, res, next) => {
  try {
    await limiter.check(res, 25, 'CACHE_TOKEN') // 25 requests per minute
    return await next()
  } catch {
    return res.status(429).json({ status: 'error', message: 'Rate limit exceeded' })
  }
}

export default rateLimitMiddleware
