import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'

import { clientWithToken, getUserBlockouts } from '@/lib/sanity.client'
import { rateLimitMiddleware } from '../../../rateLimitMiddleware'
import { type NextApiRequestWithUser, withUser } from '../../../authMiddleware'
import { allowMethods } from '../../../allowMethodsMiddleware'

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  const { method } = req

  if (method === 'GET') {
    try {
      const blockouts = await getUserBlockouts(req.id)

      return res.status(200).json({ status: 'success', data: blockouts, message: 'ok' })
    } catch (error) {
      console.error(error)

      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  } else if (method === 'PUT') {
    const { blockoutDates }: { blockoutDates: string[] } = req.body

    try {
      await clientWithToken.patch(req.id).set({ blockouts: blockoutDates }).commit()
      console.log(blockoutDates)
      return res.status(200).json({ status: 'success', message: 'Success, updated blockouts' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  }
}

const validateFields: Middleware<NextApiRequestWithUser> = async (req, res, next) => {
  const { method, query } = req
  const { id } = query

  if (id != req.id) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized, id in path does not match id in auth cookie',
    })
  }

  if (method === 'PUT') {
    const { blockoutDates }: { blockoutDates: string[] } = req.body

    // check if blockoutDates is an array and is in yyyy-mm-dd format
    const dateRegExp = /^\d{4}-\d{2}-\d{2}$/

    if (blockoutDates.length > 0 && blockoutDates.every((date) => dateRegExp.test(date))) {
      return await next()
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Unproccesable request, fields are missing or invalid',
      })
    }
  }

  //  If the request is not a POST request, which means it's a GET request, then just continue to the next middleware
  return await next()
}

export default use(
  rateLimitMiddleware,
  allowMethods(['GET', 'PUT']),
  withUser,
  validateFields,
  handler
)
