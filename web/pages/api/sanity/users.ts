import { getAllUsers } from '@/lib/sanity.client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { use } from 'next-api-route-middleware'

import { allowMethods } from '../allowMethodsMiddleware'
import { withUser } from '../authMiddleware'
import { rateLimitMiddleware } from '../rateLimitMiddleware'

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const user = await getAllUsers()

  return res.status(200).json({ status: 'success', data: user, message: 'ok' })
}

export default use(rateLimitMiddleware, allowMethods(['GET']), withUser, handler)
