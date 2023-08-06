import { useSession } from 'next-auth/react'
import useSWR from 'swr'

import { type TDateISODate } from '@/lib/sanity.queries'
import siteConfig from '@/../site.config'
import * as demo from '@/lib/demo.data'

export default function useUpcomingDuties() {
  const { data: session } = useSession()

  const isDemo = session?.user?.id === siteConfig.demoUserId

  const { data, error, isLoading } = useSWR<TDateISODate[]>(
    !isDemo && session?.user?.id ? `/api/sanity/user/${session?.user?.id}/upcoming-duties` : null,
  )

  if (isDemo) {
    return {
      data: demo.upcomingDuties,
      isLoading: false,
      error: null,
    }
  }

  return {
    data,
    isLoading,
    error,
  }
}
