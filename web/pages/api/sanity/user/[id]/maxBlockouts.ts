import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'

import { clientWithToken } from '@/lib/sanity.client'
import { rateLimitMiddleware } from '../../../rateLimitMiddleware'
import { type NextApiRequestWithUser, withUser } from '../../../authMiddleware'
import { allowMethods } from '../../../allowMethodsMiddleware'

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  const { query, body } = req
  const { id } = query

  if (!id || typeof id !== 'string')
    return res.status(500).json({ status: 'error', message: 'Something went wrong' })

  try {
    const updatedUser = await clientWithToken
      .patch(id)
      .set({
        maxBlockouts: body.maxBlockouts,
      })
      .commit()

    console.log('updatedUser rev: ', updatedUser._rev)

    return res.status(200).json({ status: 'success', message: 'ok' })
  } catch (error) {
    console.error(error)

    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}

const validateFields: Middleware<NextApiRequestWithUser> = async (req, res, next) => {
  const { query, body } = req
  const { id } = query

  const { maxBlockouts } = body

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Bad request, id in path is missing or not a string',
    })
  } else if (req.role !== 'admin') {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized, only admins can access this route',
    })
  }

  // Check if maxBlockouts is a number
  if (typeof maxBlockouts !== 'number') {
    return res.status(400).json({
      status: 'error',
      message: 'Bad request, maxBlockouts is not a number',
    })
  }

  return await next()
}

export default use(rateLimitMiddleware, allowMethods(['PUT']), withUser, validateFields, handler)
