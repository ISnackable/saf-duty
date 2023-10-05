import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'

import {
  clientWithToken,
  getAllUsers,
  getCalendarById,
  getUserSwapRequest,
} from '@/lib/sanity.client'
import type { Roster } from '@/lib/sanity.queries'
import { rateLimitMiddleware } from '../../../rateLimitMiddleware'
import { type NextApiRequestWithUser, withUser } from '../../../authMiddleware'
import { allowMethods } from '../../../allowMethodsMiddleware'

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  console.log('swap request handler called')
  const { body, method } = req
  const { calendar, receiver, receiverDate, requester, requesterDate, reason, action } = body

  if (method === 'GET') {
    try {
      const swapRecords = await getUserSwapRequest(req.id)

      return res.status(200).json({ status: 'success', data: swapRecords, message: 'ok' })
    } catch (error) {
      console.error(error)

      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  } else if (method === 'POST') {
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
    if (action === 'approve') {
      try {
        const calendarDoc = await getCalendarById(calendar)

        console.log(calendarDoc)

        if (!calendarDoc) {
          return res.status(404).json({ status: 'error', message: 'Calendar not found' })
        }

        const { roster } = calendarDoc

        // Check if the swap request is still valid (pending), if not, return an error
        // Check if the requester and receiver still have the same dates
        const requesterRosterIndex = roster.findIndex(
          (r) => r.date === requesterDate && r.personnel.id === requester,
        )
        const receiverRosterIndex = roster.findIndex(
          (r) => r.date === receiverDate && r.personnel.id === receiver,
        )

        if (requesterRosterIndex === -1 || receiverRosterIndex === -1) {
          await clientWithToken.delete(`${requesterDate}-${requester}-${receiverDate}-${receiver}`)

          return res.status(404).json({
            status: 'error',
            message:
              'Roster is not valid anymore, this can be due to someone already swapped shift.',
          })
        }

        const requesterRoster = roster[requesterRosterIndex]
        const receiverRoster = roster[receiverRosterIndex]

        let previousRequesterRoster: Roster | undefined
        let previousReceiverRoster: Roster | undefined
        let nextRequesterRoster: Roster | undefined
        let nextReceiverRoster: Roster | undefined

        // Get the previous day of the requesterRoster and receiverRoster, unless the previous day is the first day of the month
        const previousRequesterRosterIndex = requesterRosterIndex - 1
        const previousReceiverRosterIndex = receiverRosterIndex - 1

        if (previousRequesterRosterIndex >= 0 && previousReceiverRosterIndex >= 0) {
          previousRequesterRoster = roster[previousRequesterRosterIndex]
          previousReceiverRoster = roster[previousReceiverRosterIndex]
        }

        // Get the next day of the requesterRoster and receiverRoster, unless the next day is the last day of the month
        const nextRequesterRosterIndex = requesterRosterIndex + 1
        const nextReceiverRosterIndex = receiverRosterIndex + 1

        if (nextRequesterRosterIndex < roster.length && nextReceiverRosterIndex < roster.length) {
          nextRequesterRoster = roster[nextRequesterRosterIndex]
          nextReceiverRoster = roster[nextReceiverRosterIndex]
        }

        const users = await getAllUsers(req.unit)

        // Get all the users who are available on the requester date
        const availableUsersOnRequesterDate = users.filter((user) => {
          const { blockouts } = user

          if (user.id === requester) return false
          else if (!blockouts) return false
          else if (
            (previousRequesterRoster && previousRequesterRoster.personnel.id === user.id) ||
            (previousRequesterRoster && previousRequesterRoster.standby.id === user.id) ||
            (nextRequesterRoster && nextRequesterRoster.personnel.id === user.id) ||
            (nextRequesterRoster && nextRequesterRoster.standby.id === user.id)
          ) {
            return false
          }

          const isAvailable = !blockouts.includes(requesterDate)

          return isAvailable
        })

        // Get all the users who are available on the receiver date
        const availableUsersOnReceiverDate = users.filter((user) => {
          const { blockouts } = user

          if (user.id === receiver) return false
          else if (!blockouts) return false
          else if (
            (previousRequesterRoster && previousRequesterRoster.personnel.id === user.id) ||
            (previousRequesterRoster && previousRequesterRoster.standby.id === user.id) ||
            (nextRequesterRoster && nextRequesterRoster.personnel.id === user.id) ||
            (nextRequesterRoster && nextRequesterRoster.standby.id === user.id)
          ) {
            return false
          }
          const isAvailable = !blockouts.includes(receiverDate)

          return isAvailable
        })

        if (!availableUsersOnRequesterDate.length || !availableUsersOnReceiverDate.length) {
          return res.status(400).json({
            status: 'error',
            message: 'There are no available stand-in users for the requester or receiver date',
          })
        }

        // By default, the stand-in will be the same as the original standin
        let newRequesterStandIn = requesterRoster.standby.id
        let newReceiverStandIn = receiverRoster.standby.id

        if (
          requesterRoster.standby.id === receiver ||
          (previousRequesterRoster &&
            previousRequesterRoster.personnel.id === requesterRoster.standby.id) ||
          (previousRequesterRoster &&
            previousRequesterRoster.standby.id === requesterRoster.standby.id) ||
          (nextRequesterRoster &&
            nextRequesterRoster.personnel.id === requesterRoster.standby.id) ||
          (nextRequesterRoster && nextRequesterRoster.standby.id === requesterRoster.standby.id)
        ) {
          // Assign a random user from the availableUsersOnRequesterDate
          newRequesterStandIn =
            availableUsersOnRequesterDate[
              Math.floor(Math.random() * availableUsersOnRequesterDate.length)
            ].id
        }

        if (
          receiverRoster.standby.id === requester ||
          (previousReceiverRoster &&
            previousReceiverRoster.personnel.id === receiverRoster.standby.id) ||
          (previousReceiverRoster &&
            previousReceiverRoster.standby.id === receiverRoster.standby.id) ||
          (nextReceiverRoster && nextReceiverRoster.personnel.id === receiverRoster.standby.id) ||
          (nextReceiverRoster && nextReceiverRoster.standby.id === receiverRoster.standby.id)
        ) {
          // Assign a random user from the availableUsersOnReceiverDate
          newReceiverStandIn =
            availableUsersOnReceiverDate[
              Math.floor(Math.random() * availableUsersOnReceiverDate.length)
            ].id
        }

        // const newRoster = [...roster] as object[]

        // newRoster[requesterRosterIndex] = {
        //   _key: requesterRoster.date,
        //   date: requesterRoster.date,
        //   // TODO: Check if the date is a weekend, then it can be an extra, if not the swap should be allowed
        //   isExtra: receiverRoster.isExtra,
        //   dutyPersonnel: {
        //     _type: 'reference',
        //     _ref: receiver,
        //     _weak: true,
        //   },
        //   dutyPersonnelStandIn: {
        //     _type: 'reference',
        //     _ref: newReceiverStandIn,
        //     _weak: true,
        //   },
        // }

        // newRoster[receiverRosterIndex] = {
        //   _key: receiverRoster.date,
        //   date: receiverRoster.date,
        //   isExtra: requesterRoster.isExtra,
        //   dutyPersonnel: {
        //     _type: 'reference',
        //     _ref: requester,
        //     _weak: true,
        //   },
        //   dutyPersonnelStandIn: {
        //     _type: 'reference',
        //     _ref: newRequesterStandIn,
        //     _weak: true,
        //   },
        // }

        const newRoster = roster.map((r) => {
          // If newRequesterStandIn or newReceiverStandIn is not defined, then just return the original stand-in

          return {
            _key: r.date,
            date: r.date,
            isExtra:
              r.date === requesterDate
                ? receiverRoster.isExtra
                : r.date === receiverDate
                ? requesterRoster.isExtra
                : r.isExtra,
            dutyPersonnel: {
              _type: 'reference',
              _ref:
                r.date === requesterDate
                  ? receiver
                  : r.date === receiverDate
                  ? requester
                  : r.personnel.id,
              _weak: true,
            },
            dutyPersonnelStandIn: {
              _type: 'reference',
              _ref:
                r.date === requesterDate
                  ? newReceiverStandIn
                  : r.date === receiverDate
                  ? newRequesterStandIn
                  : r.standby.id,
              _weak: true,
            },
          }
        })

        const sanityRes = await clientWithToken
          .transaction()
          .patch(calendarDoc.id, (patch) => patch.set({ roster: newRoster }))
          .delete(`${requesterDate}-${requester}-${receiverDate}-${receiver}`)
          .commit()

        console.log('successfully swap shift: ', sanityRes.transactionId)

        return res.status(200).json({ status: 'success', message: 'ok' })
      } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Something went wrong' })
      }
    } else if (action === 'deny') {
      try {
        await clientWithToken.delete(`${requesterDate}-${requester}-${receiverDate}-${receiver}`)

        return res
          .status(200)
          .json({ status: 'success', message: 'Successfully declined the swap request' })
      } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Something went wrong' })
      }
    }
  } else if (method === 'DELETE') {
    try {
      await clientWithToken.delete(`${requesterDate}-${requester}-${receiverDate}-${receiver}`)

      return res
        .status(200)
        .json({ status: 'success', message: 'Successfully deleted the swap request' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
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

  if (method === 'POST' || method === 'PATCH') {
    // TODO:// Validate fields of adding a swap request
    // 1. Should validate whether the user and the target user has already made a swap request (Does this matter? as we can just overwrite it)
    // 2. Should validate whether the user and the target user are in the same unit
    const { calendar, receiver, receiverDate, requester, requesterDate, action } = body
    console.log(
      'swap request fields: ',
      calendar,
      receiver,
      receiverDate,
      requester,
      requesterDate,
      action,
    )

    if (
      // !calendar ||
      !receiver ||
      !receiverDate ||
      !requester ||
      !requesterDate ||
      (method === 'PATCH' && !['approve', 'deny'].includes(action))
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Unproccesable request, fields are missing or invalid',
      })
    }
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
