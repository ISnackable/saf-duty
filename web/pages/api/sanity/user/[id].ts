import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'
// import { getUserByIdQuery } from 'next-auth-sanity/queries'
// import argon2 from 'argon2'

// import { checkPasswordValidation } from '@/pages/api/sanity/signUp'
import type { TDateISODate } from '@/lib/sanity.queries'
import { clientWithToken, getUserById } from '@/lib/sanity.client'
import { rateLimitMiddleware } from '../../rateLimitMiddleware'
import { type NextApiRequestWithUser, withUser } from '../../authMiddleware'
import { allowMethods } from '../../allowMethodsMiddleware'

interface User {
  name: string
  image: string
  weekdayPoints: number
  weekendPoints: number
  extra: number
  enlistment?: TDateISODate
  ord?: TDateISODate
  blockouts?: TDateISODate[]
}

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  const { method, body, query } = req
  const { id } = query

  if (!id || typeof id !== 'string')
    return res.status(500).json({ status: 'error', message: 'Something went wrong' })

  if (method === 'GET') {
    try {
      const user = await getUserById(req.id)

      return res.status(200).json({ status: 'success', data: user, message: 'ok' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  } else if (method === 'PUT') {
    const { name, image, weekdayPoints, weekendPoints, extra, enlistment, ord, blockouts }: User =
      body

    try {
      const updatedUser = await clientWithToken
        .patch(id)
        .set({
          name,
          image,
          weekdayPoints,
          weekendPoints,
          extra,
          enlistment,
          ord,
          blockouts: blockouts ? blockouts : [],
        })
        // conditionally unset enlistment and ord if they are null
        .unset(!enlistment || !ord ? ['enlistment', 'ord'] : [])
        .commit()

      console.log('updatedUser rev: ', updatedUser._rev)

      return res.status(200).json({ status: 'success', message: 'ok' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  }
  /* else if (method === 'DELETE') {
    try {
      const user = await clientWithToken.fetch(getUserByIdQuery, { id: req.id })

      const { oldPassword } = body

      // Check if old password is correct
      const isOldPasswordCorrect = await argon2.verify(user?.password, oldPassword)

      if (!isOldPasswordCorrect) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized, old password is incorrect',
        })
      }

      // TODO: Maybe instead of deleting the user, just set the password to null,
      // so that the user can still login with the same email, but can't access any of the data.
      // Update a field (disabled) to say that the user is deleted, so that the user can't login anymore.
      const response = await clientWithToken.delete(user.id)
      console.log(response)

      return res.status(200).json({ status: 'success', message: 'Successfully deleted user' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  } */
}

const validateFields: Middleware<NextApiRequestWithUser> = async (req, res, next) => {
  const { method, body, query } = req
  const { id } = query

  if (method === 'GET') {
    if (id != req.id) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized, id in path does not match id in auth cookie',
      })
    }
  } else if (method === 'PUT') {
    if (req.role !== 'admin') {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      })
    }

    // Simple validation to check if all fields are present
    const { name, image, weekdayPoints, weekendPoints, extra }: User = body

    if (
      !name ||
      !image ||
      typeof weekdayPoints !== 'number' ||
      typeof weekendPoints !== 'number' ||
      typeof extra !== 'number'
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Unproccesable request, fields are missing or invalid',
      })
    }
  }

  // else if (method === 'DELETE') {
  //   const { oldPassword } = body
  //   console.log('oldPassword', checkPasswordValidation(oldPassword))

  //   if (checkPasswordValidation(oldPassword) !== null) {
  //     return res.status(400).json({
  //       status: 'error',
  //       message: 'Unproccesable request, fields are missing or invalid',
  //     })
  //   }
  // }

  //  If the request is not a PUT request, which means it's a GET request, then just continue to the next middleware
  return await next()
}

export default use(
  rateLimitMiddleware,
  allowMethods(['GET', 'DELETE', 'PUT']),
  withUser,
  validateFields,
  handler,
)
