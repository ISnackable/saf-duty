import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'

import { clientWithToken, getUserSwapRequest } from '@/lib/sanity.client'
import { rateLimitMiddleware } from '../../../rateLimitMiddleware'
import { type NextApiRequestWithUser, withUser } from '../../../authMiddleware'
import { allowMethods } from '../../../allowMethodsMiddleware'

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  console.log('swap request handler called')
  const { body, method } = req

  if (method === 'GET') {
    try {
      const swapRecords = await getUserSwapRequest(req.id)

      return res.status(200).json({ status: 'success', data: swapRecords, message: 'ok' })
    } catch (error) {
      console.error(error)

      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  } else if (method === 'POST') {
    const { calendar, receiver, receiverDate, requester, requesterDate, reason } = body

    const doc = {
      _id: `${requesterDate}-${requester}-${receiverDate}-${receiver}`,
      _type: 'swapRequest',
      calendar: {
        _type: 'reference',
        _ref: calendar,
        _weak: true,
      },
      receiver: {
        _type: 'reference',
        _ref: receiver,
        _weak: true,
      },
      receiverDate,
      requester: {
        _type: 'reference',
        _ref: requester,
        _weak: true,
      },
      requesterDate,
      reason,
      status: 'pending',
    }

    try {
      const sanityRes = await clientWithToken.createOrReplace(doc)

      console.log(`new swap request was created, document ID is ${sanityRes._id}`)

      return res.status(201).json({ status: 'success', message: 'ok' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  } else if (method === 'PATCH') {
    //   const rec = await clientWithToken
    // .patch('bike-123') // Document ID to patch
    // .set({status})
    // .commit()

    // console.log(rec)

    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}

const validateFields: Middleware<NextApiRequestWithUser> = async (req, res, next) => {
  const { method, body, query } = req
  const { id } = query

  if (id != req.id) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized, id in path does not match id in auth cookie',
    })
  }

  if (method === 'POST') {
    // TODO:// Validate fields of adding a swap request
    // 1. Should validate whether the user and the target user has already made a swap request (Does this matter? as we can just overwrite it)
    // 2. Should validate whether the user and the target user are in the same unit
    const { calendar, receiver, receiverDate, requester, requesterDate } = body
    console.log(calendar, receiver, receiverDate, requester, requesterDate)

    if (!calendar || !receiver || !receiverDate || !requester || !requesterDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Unproccesable request, fields are missing or invalid',
      })
    }
  } else if (method === 'PATCH') {
    // Approve or decline a swap request sent to the user
    // or cancel a swap request sent by the user
  } else if (method === 'DELETE') {
    // Delete a swap request sent by the user
  }

  return await next()
}

export default use(
  rateLimitMiddleware,
  allowMethods(['GET', 'POST', 'PATCH', 'DELETE']),
  withUser,
  validateFields,
  handler,
)
