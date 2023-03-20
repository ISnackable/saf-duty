import { Middleware } from 'next-api-route-middleware'

export const allowMethods = (allowedMethods: string[]): Middleware => {
  return async function (req, res, next) {
    const { method } = req

    if (allowedMethods.includes(method ?? 'NEVER')) {
      await next()
    } else {
      res.setHeader('Allow', allowedMethods)
      return res.status(405).send({ status: 'error', message: `${method} not allowed.` })
    }
  }
}
