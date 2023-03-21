import { NextApiRequest } from 'next'
import type { User } from 'next-auth'
import type { Middleware } from 'next-api-route-middleware'
import { getServerSession } from 'next-auth/next'

import config from '@/../site.config'
import { createOptions } from './auth/[...nextauth]'

export type NextApiRequestWithUser = NextApiRequest & User

export const withUser: Middleware<NextApiRequestWithUser> = async (req, res, next) => {
  const { method } = req
  const session = await getServerSession(req, res, createOptions(req))

  if (session && session.user) {
    // Only allow GET requests for demo user
    if (session.user.id === config.demoUserId && method !== 'GET') {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized, demo user is not allowed to do this',
      })
    }

    req.id = session.user.id
    req.role = session.user.role
    return await next()
  } else {
    return res.status(401).send({ status: 'error', message: 'Unauthorized, invalid auth cookie' })
  }
}
