import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'

import { checkNameValidation } from '@/pages/api/sanity/signUp'
import { clientWithToken } from '@/lib/sanity.client'
import { rateLimitMiddleware } from '../../../rateLimitMiddleware'
import { type NextApiRequestWithUser, withUser } from '../../../authMiddleware'
import { allowMethods } from '../../../allowMethodsMiddleware'

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  const { name, enlistment, ord } = req.body

  try {
    const newUser = await clientWithToken.patch(req.id).set({ name, enlistment, ord }).commit()
    console.log(newUser)

    return res.status(200).json({ status: 'success', message: 'Success, updated user' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}

const validateFields: Middleware<NextApiRequestWithUser> = async (req, res, next) => {
  const { body, query } = req
  const { name } = body
  const { id } = query

  if (id != req.id) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized, id in path does not match id in auth cookie',
    })
  }

  console.log(checkNameValidation(name))

  if (checkNameValidation(name) === null) {
    return await next()
  } else {
    return res.status(400).json({
      status: 'error',
      message: 'Unproccesable request, fields are missing or invalid',
    })
  }
}

export default use(rateLimitMiddleware, allowMethods(['PUT']), withUser, validateFields, handler)