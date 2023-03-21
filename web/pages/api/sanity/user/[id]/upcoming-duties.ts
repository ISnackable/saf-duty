import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'

import { getUserUpcomingDuties } from '@/lib/sanity.client'
import { rateLimitMiddleware } from '../../../rateLimitMiddleware'
import { type NextApiRequestWithUser, withUser } from '../../../authMiddleware'
import { allowMethods } from '../../../allowMethodsMiddleware'

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const upcomingDuties = await getUserUpcomingDuties(req.id)

    return res.status(200).json({ status: 'success', data: upcomingDuties, message: 'ok' })
  } catch (error) {
    console.error(error)

    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}

const validateFields: Middleware<NextApiRequestWithUser> = async (req, res, next) => {
  const { query } = req
  const { id } = query

  if (id != req.id) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized, id in path does not match id in auth cookie',
    })
  }

  return await next()
}

export default use(rateLimitMiddleware, allowMethods(['GET']), withUser, validateFields, handler)
