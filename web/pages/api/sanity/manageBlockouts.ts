import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { Middleware, use } from 'next-api-route-middleware'

import { clientWithToken } from '@/lib/sanity.client'
import { authOptions } from '../auth/[...nextauth]'
import { rateLimitMiddleware } from '../rateLimitMiddleware'
import config from '@/../site.config'

async function updateBlockoutHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') return res.status(404).send('Not found')

  console.log('Reached update blockout handler')

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
      message: 'Unauthorized, you are not allowed to update this user blockouts',
    })
  }

  const { blockoutDates }: { blockoutDates: string[] } = req.body

  try {
    await clientWithToken.patch(userId).set({ blockouts: blockoutDates }).commit()
    console.log(blockoutDates)
    return res.status(200).json({ status: 'success', message: 'Success, updated blockouts' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}

const validateFields: Middleware = async (req, res, next) => {
  const { blockoutDates }: { blockoutDates: string[] } = req.body

  // check if blockoutDates is an array and is in yyyy-mm-dd format
  const dateRegExp = /^\d{4}-\d{2}-\d{2}$/

  if (blockoutDates.length > 0 && blockoutDates.every((date) => dateRegExp.test(date))) {
    return await next()
  } else {
    return res.status(422).json({
      status: 'error',
      message: 'Unproccesable request, fields are missing or invalid',
    })
  }
}

export default use(rateLimitMiddleware, validateFields, updateBlockoutHandler)
