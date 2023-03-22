import { getAllUsers } from '@/lib/sanity.client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { use } from 'next-api-route-middleware'

import { allowMethods } from '../allowMethodsMiddleware'
import { withUser } from '../authMiddleware'
import { rateLimitMiddleware } from '../rateLimitMiddleware'

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await getAllUsers()

    return res.status(200).json({ status: 'success', data: users, message: 'ok' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}

export default use(rateLimitMiddleware, allowMethods(['GET']), withUser, handler)
