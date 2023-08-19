import type { NextApiRequest, NextApiResponse } from 'next'
import { use } from 'next-api-route-middleware'
import { parseBody } from 'next-sanity/webhook'
import webPush from 'web-push'
import { rateLimitMiddleware } from './rateLimitMiddleware'
import { allowMethods } from './allowMethodsMiddleware'
import { clientWithToken } from '@/lib/sanity.client'

// Export the config from next-sanity to enable validating the request body signature properly
export { config } from 'next-sanity/webhook'

interface DutyPersonnel {
  id: string
  subscription: string
}

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || '',
  process.env.WEB_PUSH_PRIVATE_KEY || '',
)

/**
 * -- Sanity Webhook Structure --
 * Name: New Calendar Roster Notification
 * Description: Sends a push notification to the user when a new calendar roster is published
 * URL: https://<your-domain>/api/notification
 * Trigger On: Create
 * Filter: `_type == "calendar"`
 * Projection: `{
 *  date,
 *  "dutyPersonnels": roster[].dutyPersonnel {
 *    "id": _ref,
 *    "dutyPersonnelSubscription": @->pushSubscription
 *  }
 * }`
 * HTTP Method: POST
 * Secret: SANITY_WEBHOOK_SECRET
 */

export function sendPushNotification(
  subscription: webPush.PushSubscription,
  payload: string,
  userId: string,
) {
  return webPush
    .sendNotification(
      subscription,
      JSON.stringify({
        title: '',
        message: payload,
      }),
    )
    .catch((err: webPush.WebPushError) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.log('Subscription has expired or is no longer valid: ', err)

        deleteSubscriptionFromDatabase(userId)
      } else {
        console.error(err)
        throw err
      }
      return err
    })
}

export function deleteSubscriptionFromDatabase(userId: string) {
  // delete subscription from database
  clientWithToken.patch(userId).unset(['pushSubscription']).commit()
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { isValidSignature, body } = await parseBody(req, process.env.SANITY_WEBHOOK_SECRET)

    if (!isValidSignature) {
      const message = 'Invalid signature'
      console.warn(message)
      return res.status(401).send({ status: 'error', message: `Unauthorized, ${message}` })
    } else if (!body)
      return res.status(400).json({ status: 'error', message: 'Bad request, empty body' })

    // TODO: swap-request and calendar are the only types that are allowed to be published

    // Locale date string formatted as "Month Year"
    const rosterLocaleDateString = new Date(body.date as string).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })

    // Remove all duplicate dutyPersonnels and dutyPersonnels without a subscription from the array
    let dutyPersonnelsWithSubscriptions: DutyPersonnel[] = body.dutyPersonnels as DutyPersonnel[]
    const ids = dutyPersonnelsWithSubscriptions.map(({ id }) => id)
    dutyPersonnelsWithSubscriptions = dutyPersonnelsWithSubscriptions.filter(
      ({ id, subscription }, index) => !ids.includes(id, index + 1) && subscription,
    )

    // for (let i = 0; i < dutyPersonnels.length; i++) {
    //   const subscription = await getUserPushSubscription(dutyPersonnels[i])
    //   if (!subscription) continue

    //   try {
    //     dutyPersonnelsWithSubscriptions.push({
    //       id: dutyPersonnels[i],
    //       subscription: JSON.parse(subscription),
    //     })
    //   } catch (error) {
    //     console.error(error)
    //     deleteSubscriptionFromDatabase(dutyPersonnels[i])
    //   }
    // }

    if (!dutyPersonnelsWithSubscriptions.length)
      return res.status(404).json({ status: 'error', message: 'Subscriptions not found' })

    // send push notification all the users
    await Promise.all(
      dutyPersonnelsWithSubscriptions.map((dutyPersonnel) =>
        sendPushNotification(
          JSON.parse(dutyPersonnel.subscription),
          `${rosterLocaleDateString} roster has been published. Open the app to view your duty.`,
          dutyPersonnel.id,
        ),
      ),
    )

    return res.status(200).json({ status: 'success', message: 'ok' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}

export default use(rateLimitMiddleware, allowMethods(['POST']), handler)
