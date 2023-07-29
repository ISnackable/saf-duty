import type { NextApiResponse } from 'next'
import { type Middleware, use } from 'next-api-route-middleware'
import getRawBody from 'raw-body'
import imageType from 'image-type'

import { clientWithToken } from '@/lib/sanity.client'
import { type NextApiRequestWithUser, withUser } from '../../../authMiddleware'
import { allowMethods } from '../../../allowMethodsMiddleware'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  const rawBody = await getRawBody(req)
  const imageMime = await imageType(rawBody)

  //  Restrict file size to 5MB
  if (rawBody.length > 5 * 1024 * 1024) {
    return res.status(400).json({
      status: 'error',
      message: 'Unproccesable request, image is too large, max size is 5MB',
    })
  }

  // Restrict file types to jpeg and png
  if (imageMime?.mime !== 'image/jpeg' && imageMime?.mime !== 'image/png') {
    return res.status(400).json({
      status: 'error',
      message: 'Unproccesable request, image is invalid',
    })
  }

  try {
    clientWithToken.assets
      .upload('image', rawBody, {
        contentType: imageMime.mime,
      })
      .then((imageAsset) => {
        return clientWithToken
          .patch(req.id)
          .set({
            avatar: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageAsset._id,
              },
            },
            image: imageAsset.url,
          })
          .commit()
      })
      .then(() => {
        console.log('Successfully updated avatar')
        return res.status(200).json({ status: 'success', message: 'Success, updated Avatar' })
      })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}

const validateFields: Middleware<NextApiRequestWithUser> = async (req, res, next) => {
  const { id } = req.query
  if (id != req.id) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized, id in path does not match id in auth cookie',
    })
  }

  return await next()
}

export default use(allowMethods(['POST']), withUser, validateFields, handler)
