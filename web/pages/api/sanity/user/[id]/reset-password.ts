import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'

import { clientWithToken } from '@/lib/sanity.client'
import { rateLimitMiddleware } from '../../../rateLimitMiddleware'
import { type NextApiRequestWithUser, withUser } from '../../../authMiddleware'
import { allowMethods } from '../../../allowMethodsMiddleware'

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  console.log('reached reset password api')

  const { query } = req
  const { id } = query

  if (!id || typeof id !== 'string')
    return res.status(500).json({ status: 'error', message: 'Something went wrong' })

  try {
    const updatedUser = await clientWithToken
      .patch(id)
      .set({
        // TODO: generate random password
        // Default: Password@1234
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$EQKzQZ2S9NiMCGNCtl2aiw$WL2s+JdvyyEwJno+ZSNksWYruZOtQKvF6TdAIlbk1pw',
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
  const { query } = req
  const { id } = query

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

  return await next()
}

export default use(rateLimitMiddleware, allowMethods(['PUT']), withUser, validateFields, handler)
