import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'

import { clientWithToken } from '@/lib/sanity.client'
import { rateLimitMiddleware } from '../../../rateLimitMiddleware'
import { type NextApiRequestWithUser, withUser } from '../../../authMiddleware'
import { allowMethods } from '../../../allowMethodsMiddleware'

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  console.log('save subscription handler called')
  const { body, method } = req

  if (method === 'POST') {
    try {
      await clientWithToken
        .patch(req.id)
        .set({ pushSubscription: `${JSON.stringify(body)}` })
        .commit()
      return res
        .status(200)
        .json({ status: 'success', message: 'Success, updated push subscription' })
    } catch (error) {
      console.error(error)

      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  } else if (method === 'DELETE') {
    try {
      await clientWithToken.patch(req.id).unset(['pushSubscription']).commit()
      return res
        .status(200)
        .json({ status: 'success', message: 'Success, deleted push subscription' })
    } catch (error) {
      console.error(error)

      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  }
}

const validateFields: Middleware<NextApiRequestWithUser> = async (req, res, next) => {
  const { query, body, method } = req
  const { id } = query

  if (id != req.id) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized, id in path does not match id in auth cookie',
    })
    // Check the request body has at least an endpoint.
  } else if (method === 'POST' && (!body || !body.endpoint)) {
    return res.status(400).json({
      status: 'error',
      message: 'Bad request, missing endpoint in body',
    })
  }

  return await next()
}

export default use(
  rateLimitMiddleware,
  allowMethods(['POST', 'DELETE']),
  withUser,
  validateFields,
  handler
)
