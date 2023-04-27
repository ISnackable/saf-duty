import type { NextApiRequest, NextApiResponse } from 'next'
import { use } from 'next-api-route-middleware'
import { parseBody } from 'next-sanity/webhook'
import webPush from 'web-push'
import { rateLimitMiddleware } from './rateLimitMiddleware'
import { allowMethods } from './allowMethodsMiddleware'
import { getUserPushSubscription } from '@/lib/sanity.client'

// Export the config from next-sanity to enable validating the request body signature properly
export { config } from 'next-sanity/webhook'

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || '',
  process.env.WEB_PUSH_PRIVATE_KEY || ''
)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { isValidSignature, body } = await parseBody(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      const message = 'Invalid signature'
      console.warn(message)
      return res.status(401).send({ status: 'error', message: `Unauthorized, ${message}` })
    }

    // get user's subscription from database using the id in the body
    const subscription = JSON.parse(await getUserPushSubscription(body._id))

    webPush
      .sendNotification(subscription, JSON.stringify({ title: 'Hello Web Push', message: 'HELLO' }))
      .then((response) => {
        res.writeHead(response.statusCode, response.headers).end(response.body)
      })
      .catch((err) => {
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.log('Subscription has expired or is no longer valid: ', err)
          res.writeHead(err.statusCode, err.headers).end(err.body)
          // return deleteSubscriptionFromDatabase(subscription._id);
          return res.status(200).json({ status: 'success', message: 'ok' })
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
