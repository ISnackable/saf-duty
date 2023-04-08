import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'

import { checkNameValidation } from '@/pages/api/sanity/signUp'
import { clientWithToken } from '@/lib/sanity.client'
import { rateLimitMiddleware } from '../../../rateLimitMiddleware'
import { type NextApiRequestWithUser, withUser } from '../../../authMiddleware'
import { allowMethods } from '../../../allowMethodsMiddleware'
export const config = {
  api: {
    bodyParser: false,
  },
}

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  const { avatar } = req.body
  /*
  if (avatar) {
    // If the user has an avatar, delete it
    await clientWithToken.patch(req.id).unset(avatar).commit()
  }
*/
  try {
    const newUser = await clientWithToken.patch(req.id).set({ avatar }).commit()
    console.log(newUser)
    console.log('file' + avatar)

    return res.status(200).json({ status: 'success', message: 'Success, updated Avatar' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}
/*
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
}*/

export default use(rateLimitMiddleware, allowMethods(['PUT']), withUser, handler)
