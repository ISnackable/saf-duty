import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'
import argon2 from 'argon2'

import { checkPasswordValidation } from '@/pages/api/sanity/signUp'
import { clientWithToken, getUserById } from '@/lib/sanity.client'
import { rateLimitMiddleware } from '../../rateLimitMiddleware'
import { type NextApiRequestWithUser, withUser } from '../../authMiddleware'
import { allowMethods } from '../../allowMethodsMiddleware'

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  const { method } = req
  if (method === 'GET') {
    const user = await getUserById(req.id)

    return res.status(200).json({ status: 'success', data: user, message: 'ok' })
  } else if (method === 'DELETE') {
    const user = await getUserById(req.id)

    const { oldPassword } = req.body

    // Check if old password is correct
    // @ts-expect-error TODO: Fix this type error later
    const isOldPasswordCorrect = await argon2.verify(user?.password, oldPassword)

    if (!isOldPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized, old password is incorrect',
      })
    }

    try {
      const response = await clientWithToken.delete(user.id)
      console.log(response)

      return res.status(200).json({ status: 'success', message: 'Successfully deleted user' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  }
}

const validateFields: Middleware = async (req, res, next) => {
  const { method } = req

  if (method === 'DELETE') {
    const { oldPassword } = req.body
    console.log('oldPassword', checkPasswordValidation(oldPassword))

    if (checkPasswordValidation(oldPassword) === null) {
      return await next()
    } else {
      return res.status(422).json({
        status: 'error',
        message: 'Unproccesable request, fields are missing or invalid',
      })
    }
  }

  //  If the request is not a PUT request, which means it's a GET request, then just continue to the next middleware
  return await next()
}

export default use(
  rateLimitMiddleware,
  allowMethods(['GET', 'DELETE']),
  validateFields,
  withUser,
  handler
)
