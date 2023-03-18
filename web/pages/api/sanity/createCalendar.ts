import { clientWithToken } from '@/lib/sanity.client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Middleware, use } from 'next-api-route-middleware'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '../auth/[...nextauth]'
import { rateLimitMiddleware } from '../rateLimitMiddleware'
import { DutyDate, Personnel } from '@/utils/dutyRoster'

async function createCalendarHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(404).send('Not found')

  console.log('Reached create calendar handler')

  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ status: 'error', message: 'You must be logged in' })
  }

  if (session?.user?.role !== 'admin') {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized, you are not allowed to update the calendar',
    })
  }

  const { dutyDates, dutyPersonnel }: { dutyDates: DutyDate[]; dutyPersonnel: Personnel[] } =
    req.body

  const roster = dutyDates.map((dutyDate) => {
    const dutyPerson = dutyPersonnel.find((person) => person.name === dutyDate.personnel)
    const dutyPersonStandIn = dutyPersonnel.find((person) => person.name === dutyDate.standby)

    return {
      _key: dutyDate.date,
      date: dutyDate.date,
      dutyPersonnel: { _type: 'reference', _ref: dutyPerson?.id, _weak: true },
      dutyPersonnelStandIn: { _type: 'reference', _ref: dutyPersonStandIn?.id, _weak: true },
    }
  })

  const doc = {
    _id: `calendar-${dutyDates[0].date}`,
    _type: 'calendar',
    date: dutyDates[0].date,
    roster: roster,
  }

  try {
    const sanityRes = await clientWithToken.createOrReplace(doc)
    const isExistingDoc = sanityRes._createdAt !== sanityRes._updatedAt

    for (const person of dutyPersonnel) {
      await clientWithToken
        .patch(person.id)
        .set({
          weekendPoints: person.weekendPoints,
          weekdayPoints: person.weekdayPoints,
          extra: person.extra,
          ...(isExistingDoc && {
            totalDutyDone: person.WD_DONE + person.WE_DONE,
          }),
        })
        .inc({
          // If the document is new, then increment, else don't defined the field
          ...(!isExistingDoc && {
            totalDutyDone: person.WD_DONE + person.WE_DONE,
          }),
        })
        .commit()
    }

    console.log(`Calendar was created, document ID is ${sanityRes._id}`)

    return res.status(200).json({ status: 'success', message: 'Calendar updated' })
  } catch (error) {
    console.error('Oh no, the update failed')

    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}

const validateFields: Middleware = async (req, res, next) => {
  const { dutyDates, dutyPersonnel }: { dutyDates: DutyDate[]; dutyPersonnel: Personnel[] } =
    req.body

  const dateRegExp = /^\d{4}-\d{2}-\d{2}$/

  if (
    dutyDates.length === 0 &&
    dutyPersonnel.length === 0 &&
    dutyDates.every((date) => !dateRegExp.test(`${date.date}`))
  ) {
    return res.status(422).json({
      status: 'error',
      message: 'Missing required fields',
    })
  }

  return await next()
}

export default use(rateLimitMiddleware, validateFields, createCalendarHandler)
