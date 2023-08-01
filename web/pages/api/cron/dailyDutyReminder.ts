import type { NextApiRequest, NextApiResponse } from 'next'
import webPush from 'web-push'

import { clientWithToken } from '@/lib/sanity.client'
import { sendPushNotification } from '../notification'
import { validateCronjobBearerToken } from './cleanupUnusedAssets'

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || '',
  process.env.WEB_PUSH_PRIVATE_KEY || '',
)

interface dutyReminder {
  date: string
  id: string
  dutyPersonnelSubscription: string
}

const query = `array::compact(*[_type == "calendar"]{
  roster[date == $tomorrow]{
   "calendar": ^._id,
   date,
   "id": dutyPersonnel._ref,
   "dutyPersonnelSubscription": dutyPersonnel->pushSubscription
 }[0]
}.roster)`

// then we need to send a push notification to the user that they have a duty on that day
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (!validateCronjobBearerToken(request)) {
    return response.status(401).end()
  }

  try {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const result: dutyReminder[] = await clientWithToken.fetch(query, {
      tomorrow: tomorrow.toLocaleDateString('sv-SE'),
    })

    // send push notification all the users
    await Promise.all(
      result
        .filter((calendar) => calendar.dutyPersonnelSubscription)
        .map((calendar) => {
          // Locale date string formatted as "Month Year"
          const rosterLocaleDateString = new Date(calendar.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })

          // send push notification all the users
          sendPushNotification(
            JSON.parse(calendar.dutyPersonnelSubscription),
            `Duty Reminder: You have a duty on ${rosterLocaleDateString} at 8:00 AM.`,
            calendar.id,
          )
        }),
    )

    return response.status(200).json({ status: 'success', message: 'ok' })
  } catch (err) {
    console.error(err)
    return response.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}
