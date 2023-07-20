import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'

import { getUserSwapRequest } from '@/lib/sanity.client'
import { rateLimitMiddleware } from '../../../rateLimitMiddleware'
import { type NextApiRequestWithUser, withUser } from '../../../authMiddleware'
import { allowMethods } from '../../../allowMethodsMiddleware'

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  console.log('swap request handler called')
  const { body, method } = req

  if (method === 'GET') {
    try {
      const swapRecords = await getUserSwapRequest(req.id)

      return res.status(200).json({ status: 'success', data: swapRecords, message: 'ok' })
    } catch (error) {
      console.error(error)

      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  } else if (method === 'POST') {
    const { swapRequest } = body
    console.log(swapRequest)

    return res.status(501).json({ status: 'error', message: 'Not Implemented' })
  }
}

const validateFields: Middleware<NextApiRequestWithUser> = async (req, res, next) => {
  const { method, body, query } = req
  const { id } = query

  if (id != req.id) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized, id in path does not match id in auth cookie',
    })
  }

  if (method === 'POST') {
    // TODO:// Validate fields of adding a swap request
    // 1. Should validate whether the user and the target user has already made a swap request
    // 2. Should validate whether the user and the target user are in the same unit
    const { swapRequest } = body
    console.log(swapRequest)
  }

  return await next()
}

export default use(
  rateLimitMiddleware,
  allowMethods(['GET', 'POST']),
  withUser,
  validateFields,
  handler,
)
