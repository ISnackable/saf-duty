import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'

import { getUserSwapRequest } from '@/lib/sanity.client'
import { rateLimitMiddleware } from '../../../rateLimitMiddleware'
import { type NextApiRequestWithUser, withUser } from '../../../authMiddleware'
import { allowMethods } from '../../../allowMethodsMiddleware'

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const swapRecords = await getUserSwapRequest(req.id)

    return res.status(200).json({ status: 'success', data: swapRecords, message: 'ok' })
  } catch (error) {
    console.error(error)

    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
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
    const { swapRequest } = body
    console.log(swapRequest)
  }

  //  If the request is not a POST request, which means it's a GET request, then just continue to the next middleware
  return await next()
}

export default use(
  rateLimitMiddleware,
  allowMethods(['GET', 'POST']),
  withUser,
  validateFields,
  handler
)
