import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { getUserByIdQuery } from 'next-auth-sanity/queries'
import * as argon2 from 'argon2'

import { writeClient } from '@/lib/sanity.client'
import { authOptions } from '../auth/[...nextauth]'
import config from '@/../site.config'

export default async function deleteUserHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(404).send('Not found')

  console.log('Reached delete user handler')

  const session = await getServerSession(req, res, authOptions)
  const userId = session?.user?.id?.replace('drafts.', '')

  if (!session) {
    return res.status(401).json({ status: 'error', message: 'You must be logged in' })
  }

  if (!session?.user?.id) {
    return res.status(422).json({
      status: 'error',
      message: 'Unproccesable request, user id not found',
    })
  }
  // Demo user
  else if (userId === config.demoUserId) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized, you are not allowed to update this user',
    })
  }

  const user = await writeClient.fetch(getUserByIdQuery, {
    userSchema: 'user',
    id: userId,
  })

  const { oldPassword } = req.body

  // Check if old password is correct
  const isOldPasswordCorrect = await argon2.verify(user?.password, oldPassword)

  if (!isOldPasswordCorrect) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized, old password is incorrect',
    })
  }

  try {
    const response = await writeClient.delete(user?._id)
    console.log(response)

    return res.status(200).json({ status: 'success', message: 'Success, deleted user' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}
