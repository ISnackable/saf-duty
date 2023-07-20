import type { NextApiRequest, NextApiResponse } from 'next'
import { use } from 'next-api-route-middleware'
import { parseBody } from 'next-sanity/webhook'
import webPush from 'web-push'
import { rateLimitMiddleware } from './rateLimitMiddleware'
import { allowMethods } from './allowMethodsMiddleware'
import { clientWithToken, getUserPushSubscription } from '@/lib/sanity.client'

// Export the config from next-sanity to enable validating the request body signature properly
export { config } from 'next-sanity/webhook'

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || '',
  process.env.WEB_PUSH_PRIVATE_KEY || '',
)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { isValidSignature, body } = await parseBody(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      const message = 'Invalid signature'
      console.warn(message)
      return res.status(401).send({ status: 'error', message: `Unauthorized, ${message}` })
    }

    // TODO: Check if the body is a calendar type or a user type
    // Check what type of body it is, and handle it accordingly
    // Two types: either a calendar type is published, or a user is sent through the webhook (on a daily cron job basis)
    // If it's a calendar type, then we need to send a push notification to the user that a new duty roster has been published
    // If it's a user type, then we need to send a push notification to the user that they have a duty on that day

    // get user's subscription from database using the id in the body
    const subscription = JSON.parse(await getUserPushSubscription(body._id))

    if (!subscription)
      return res.status(404).json({ status: 'error', message: 'Subscription not found' })

    webPush
      .sendNotification(
        subscription,
        JSON.stringify({
          title: '',
          message: `Duty Reminder: You have a duty on ${body._id} at 8:00 AM.`,
        }),
      )
      .then((response) => {
        return res.status(response.statusCode).json({ status: 'success', message: response.body })
      })
      .catch((err) => {
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.log('Subscription has expired or is no longer valid: ', err)

          // delete subscription from database
          clientWithToken.patch(body._id).unset(['pushSubscription']).commit()

          return res.status(err.statusCode).json({ status: 'success', message: 'ok' })
        } else {
          console.error(err)
        }
        return res.status(500).json({ status: 'error', message: 'Something went wrong' })
      })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}

export default use(rateLimitMiddleware, allowMethods(['GET']), handler)
