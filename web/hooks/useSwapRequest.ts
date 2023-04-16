import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { client } from '@/lib/sanity.client'
// import siteConfig from '@/../site.config'
// import * as demo from '@/lib/demo.data'
import {
  type SanitySwapRequest,
  getUserSwapRequestQuery,
  type AllSanityUser,
} from '@/lib/sanity.queries'
import useUsers from '@/hooks/useUsers'

export interface INormalizedSanitySwapRequest
  extends Omit<SanitySwapRequest, 'receiver' | 'requester'> {
  receiver?: AllSanityUser
  requester?: AllSanityUser
}

function normalizeSanityData(
  data: SanitySwapRequest,
  users: AllSanityUser[]
): INormalizedSanitySwapRequest {
  const receiver = users.find((user) => user.id === data.receiver._ref)
  const requester = users.find((user) => user.id === data.requester._ref)

  return {
    ...data,
    receiver: receiver,
    requester: requester,
  }
}

export default function useSwapRequest() {
  const { data: session } = useSession()
  const { data: users } = useUsers()

  const [swapRecords, setRecords] = useState<INormalizedSanitySwapRequest[]>([])

  // TODO: Add demo data
  // const isDemo = session?.user?.id === siteConfig.demoUserId

  useEffect(() => {
    if (session?.user?.id && users) {
      fetchRecords()

      const subscription = client
        .listen(getUserSwapRequestQuery, { id: session?.user?.id })
        .subscribe((newRecords) => {
          const item = newRecords.result as SanitySwapRequest
          // console.log(JSON.stringify(item, null, 4))

          if (item) {
            const id = item._id
            const normalizedItem = normalizeSanityData(item, users)

            // Check if the item is already in the list
            const index = swapRecords.findIndex((record) => record._id === id)

            if (index === -1) {
              // Add the item to the list
              setRecords((records) => [...records, normalizedItem])
            } else {
              // Update the item in the list
              setRecords((records) => {
                const newRecords = [...records]
                newRecords[index] = normalizedItem
                return newRecords
              })
            }
          }
        })

      return () => {
        subscription.unsubscribe()
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, users])

  async function fetchRecords() {
    if (!session?.user?.id || !users) {
      return
    }

    try {
      // const records = isDemo
      //   ? demo.swapRequests
      //   : await client.fetch(getUserSwapRequestQuery, { id: session?.user?.id })
      const records: SanitySwapRequest[] = await client.fetch(getUserSwapRequestQuery, {
        id: session?.user?.id,
      })

      if (records) {
        const normalizedRecords = records.map((record) => normalizeSanityData(record, users))
        setRecords(normalizedRecords)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return { swapRecords, setRecords }
}
