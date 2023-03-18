import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import type { Middleware } from 'next-api-route-middleware'
import { use } from 'next-api-route-middleware'

import { writeClient } from '@/lib/sanity.client'
import { checkNameValidation } from '@/pages/api/sanity/signUp'
import { authOptions } from '../auth/[...nextauth]'
import { rateLimitMiddleware } from '../rateLimitMiddleware'
//import { validateEnlistmentDate, validateOrdDate } from "@/pages/profile";
import config from '@/../site.config'

async function updateUserHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') return res.status(404).send('Not found')

  console.log('Reached update user handler')

  const session = await getServerSession(req, res, authOptions)
  const userId = session?.user?.id?.replace('drafts.', '')

  if (!session) {
    return res.status(401).json({ status: 'error', message: 'You must be logged in' })
  }

  if (!userId) {
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

  const { name, enlistment, ord } = req.body

  try {
    const newUser = await writeClient.patch(userId).set({ name, enlistment, ord }).commit()
    console.log(newUser)

    return res.status(200).json({ status: 'success', message: 'Success, updated user' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}

export const validateFields: Middleware = async (req, res, next) => {
  const { name } = req.body

  console.log(checkNameValidation(name))
  //console.log(validateEnlistmentDate(enlistment, ord));
  //console.log(validateOrdDate(enlistment, ord));

  if (
    checkNameValidation(name) === null
    //validateEnlistmentDate(enlistment, ord) === null &&
    // validateOrdDate(enlistment, ord) === null
  ) {
    return await next()
  } else {
    return res.status(422).json({
      status: 'error',
      message: 'Unproccesable request, fields are missing or invalid',
    })
  }
}

export default use(rateLimitMiddleware, validateFields, updateUserHandler)
