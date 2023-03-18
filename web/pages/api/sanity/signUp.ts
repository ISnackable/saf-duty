import type { Middleware } from 'next-api-route-middleware'
import { use } from 'next-api-route-middleware'
import { signUpHandler } from 'next-auth-sanity'
import { clientWithToken } from '@/lib/sanity.client'

import { rateLimitMiddleware } from '../rateLimitMiddleware'

// Function that checks if the password is valid, returns an error message if not
export function checkPasswordValidation(value: string) {
  const isWhitespace = /^(?=.*\s)/
  if (isWhitespace.test(value)) {
    return 'Password must not contain Whitespaces.'
  }

  const isContainsUppercase = /^(?=.*[A-Z])/
  if (!isContainsUppercase.test(value)) {
    return 'Password must have at least one Uppercase Character.'
  }

  const isContainsLowercase = /^(?=.*[a-z])/
  if (!isContainsLowercase.test(value)) {
    return 'Password must have at least one Lowercase Character.'
  }

  const isContainsNumber = /^(?=.*[0-9])/
  if (!isContainsNumber.test(value)) {
    return 'Password must contain at least one Digit.'
  }

  const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/
  if (!isContainsSymbol.test(value)) {
    return 'Password must contain at least one Special Symbol.'
  }

  const isValidLength = /^.{10,16}$/
  if (!isValidLength.test(value)) {
    return 'Password must be 10-16 Characters Long.'
  }
  return null
}

// Function that checks if the email is valid, returns an error message if not
export function checkEmailValidation(value: string) {
  const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  if (!isEmail.test(value)) {
    return 'Email is not valid.'
  }
  return null
}

// Function that checks if the name is valid, returns an error message if not
export function checkNameValidation(value: string) {
  const isName = /^[a-zA-Z '.-]*$/
  if (!isName.test(value)) {
    return 'Name is not valid.'
  }
  return null
}

export const hcaptcha: Middleware = async (req, res, next) => {
  const { body, method } = req

  console.log('Reached hcaptcha API')

  // Extract the email and captcha code from the request body
  const { captcha } = body

  if (method === 'POST') {
    try {
      const secret =
        process.env.NODE_ENV === 'development'
          ? '0x0000000000000000000000000000000000000000'
          : process.env.HCAPTCHA_SECRET_KEY

      // Ping the hcaptcha verify API to verify the captcha code you received
      const response = await fetch(`https://hcaptcha.com/siteverify`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: `response=${captcha}&secret=${secret}`,
        method: 'POST',
        cache: 'no-store',
      })
      const captchaValidation = await response.json()
      /**
       * {
       *    "success": true|false,     // is the passcode valid, and does it meet security criteria you specified, e.g. sitekey?
       *    "challenge_ts": timestamp, // timestamp of the challenge (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
       *    "hostname": string,        // the hostname of the site where the challenge was solved
       *    "credit": true|false,      // optional: whether the response will be credited
       *    "error-codes": [...]       // optional: any error codes
       *    "score": float,            // ENTERPRISE feature: a score denoting malicious activity.
       *    "score_reason": [...]      // ENTERPRISE feature: reason(s) for score. See BotStop.com for details.
       *  }
       */
      if (captchaValidation.success) {
        // Once the captcha is verified, remove the captcha code from the request body
        delete req.body['captcha']

        // Go next if everything is successful
        return await next()
      }

      return res.status(422).json({
        status: 'error',
        message: 'Unproccesable request, Invalid captcha code',
      })
    } catch (error) {
      console.log(error)
      return res.status(422).json({ status: 'error', message: 'Something went wrong' })
    }
  }
  // Return 404 if someone pings the API with a method other than
  // POST
  return res.status(404).send('Not found')
}

export const addFields: Middleware = async (req, _res, next) => {
  const seed = (Math.random() + 1).toString(36).substring(7)

  req.body['role'] = 'user'
  req.body['image'] = `https://api.dicebear.com/5.x/pixel-art/jpg?seed=${seed}`
  req.body['weekdayPoints'] = 0
  req.body['weekendPoints'] = 0
  req.body['extra'] = 0
  console.log('adding role image, weekdayPoints, weekendPoints, extra', req.body)
  return await next()
}

export const validateFields: Middleware = async (req, res, next) => {
  const { name, email, password } = req.body

  console.log(checkPasswordValidation(password))
  console.log(checkEmailValidation(email))
  console.log(checkNameValidation(name))

  if (
    checkPasswordValidation(password) === null &&
    checkEmailValidation(email) === null &&
    checkNameValidation(name) === null
  ) {
    return await next()
  } else {
    return res.status(422).json({
      status: 'error',
      message: 'Unproccesable request, fields are missing or invalid',
    })
  }
}

export default use(
  rateLimitMiddleware,
  hcaptcha,
  validateFields,
  addFields,
  signUpHandler(clientWithToken)
)
