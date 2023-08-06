import { getAllUsers } from '@/lib/sanity.client'
import type { NextApiResponse } from 'next'
import { use } from 'next-api-route-middleware'

import { allowMethods } from '../allowMethodsMiddleware'
import { type NextApiRequestWithUser, withUser } from '../authMiddleware'
import { rateLimitMiddleware } from '../rateLimitMiddleware'

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    if (!req.unit) {
      return res.status(400).json({ status: 'error', message: 'Bad request, unit code not found' })
    }
    console.log("user's unit", req.unit)
    const users = await getAllUsers(req.unit)

    return res.status(200).json({ status: 'success', data: users, message: 'ok' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}

export default use(rateLimitMiddleware, allowMethods(['GET']), withUser, handler)
