import { useSession } from 'next-auth/react'
import useSWR from 'swr'

import { type SanitySwapRequest } from '@/lib/sanity.queries'
import siteConfig from '@/../site.config'
import * as demo from '@/lib/demo.data'

export default function useSwapRequest() {
  const { data: session } = useSession()

  const isDemo = session?.user?.id === siteConfig.demoUserId

  const { data, error, isLoading, mutate } = useSWR<SanitySwapRequest[]>(
    !isDemo && session?.user?.id ? `/api/sanity/user/${session?.user?.id}/swap-request` : null,
    // { refreshInterval: 5000 },
  )

  if (isDemo) {
    return {
      data: demo.swapRecords,
      isLoading: false,
      error: null,
    }
  }

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}
