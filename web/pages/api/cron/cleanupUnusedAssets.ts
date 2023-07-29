import type { NextApiRequest, NextApiResponse } from 'next'

import { clientWithToken } from '@/lib/sanity.client'
import { type Transaction } from 'next-sanity'

const query = `*[ _type in ["sanity.imageAsset", "sanity.fileAsset"] ]
{_id, "refs": count(*[ references(^._id) ])}
[ refs == 0 ]
._id`

// This is a cron job that runs every 24 hours to delete unused assets from Sanity
export default function handler(request: NextApiRequest, response: NextApiResponse) {
  clientWithToken
    .fetch(query)
    .then((ids) => {
      if (!ids.length) {
        console.log('No assets to delete')
        return true
      }

      console.log(`Deleting ${ids.length} assets`)
      return ids
        .reduce((trx: Transaction, id: string) => trx.delete(id), clientWithToken.transaction())
        .commit()
        .then(() => response.status(200).json({ success: true }))
    })
    .catch((err) => {
      if (err.message.includes('Insufficient permissions')) {
        console.error(err.message)
        console.error('Did you forget to pass `--with-user-token`?')
      } else {
        console.error(err.stack)
      }
      response.status(404).end()
    })
}
