import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'

import { clientWithToken, getAllUserCalendar } from '@/lib/sanity.client'
import type { DutyDate, Personnel } from '@/utils/dutyRoster'
import { rateLimitMiddleware } from '../rateLimitMiddleware'
import { type NextApiRequestWithUser, withUser } from '../authMiddleware'
import { allowMethods } from '../allowMethodsMiddleware'

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  const { method } = req
  if (method === 'GET') {
    try {
      const calendar = await getAllUserCalendar(req.id)

      return res.status(200).json({ status: 'success', data: calendar, message: 'ok' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  } else if (method === 'POST') {
    // Check if user is admin
    if (req.role !== 'admin') {
      return res
        .status(401)
        .send({ status: 'error', message: 'Unauthorized, invalid auth cookie.' })
    }

    const { dutyDates, dutyPersonnel }: { dutyDates: DutyDate[]; dutyPersonnel: Personnel[] } =
      req.body

    const roster = dutyDates.map((dutyDate) => {
      const dutyPerson = dutyPersonnel.find((person) => person.name === dutyDate.personnel)
      const dutyPersonStandIn = dutyPersonnel.find((person) => person.name === dutyDate.standby)

      return {
        _key: dutyDate.date,
        date: dutyDate.date,
        isExtra: dutyDate.isExtra,
        dutyPersonnel: { _type: 'reference', _ref: dutyPerson?.id, _weak: true },
        dutyPersonnelStandIn: { _type: 'reference', _ref: dutyPersonStandIn?.id, _weak: true },
      }
    })

    const doc = {
      // TODO: Add unit reference to the calendar document, or the _id
      _id: `calendar-${dutyDates[0].date}`,
      _type: 'calendar',
      date: dutyDates[0].date,
      roster: roster,
    }

    try {
      const sanityRes = await clientWithToken.createOrReplace(doc)

      for (const person of dutyPersonnel) {
        await clientWithToken
          .patch(person.id)
          .set({
            weekendPoints: person.weekendPoints,
            weekdayPoints: person.weekdayPoints,
            extra: person.extra,
          })
          .commit()
      }

      console.log(`Calendar was created, document ID is ${sanityRes._id}`)

      return res.status(201).json({ status: 'success', message: 'Calendar updated' })
    } catch (error) {
      console.error('Oh no, the update failed')

      return res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  }
}

const validateFields: Middleware = async (req, res, next) => {
  const { method } = req

  if (method === 'POST') {
    const { dutyDates, dutyPersonnel }: { dutyDates: DutyDate[]; dutyPersonnel: Personnel[] } =
      req.body

    const dateRegExp = /^\d{4}-\d{2}-\d{2}$/

    if (
      dutyDates.length === 0 &&
      dutyPersonnel.length === 0 &&
      dutyDates.every((date) => !dateRegExp.test(`${date.date}`))
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
      })
    }
  }

  //  If the request is not a POST request, which means it's a GET request, then just continue to the next middleware
  return await next()
}

export default use(
  rateLimitMiddleware,
  allowMethods(['GET', 'POST']),
  validateFields,
  withUser,
  handler,
)
