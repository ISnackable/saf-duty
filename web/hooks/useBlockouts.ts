import { useSession } from 'next-auth/react'
import useSWRImmutable from 'swr/immutable'

import { type TDateISODate } from '@/lib/sanity.queries'
import siteConfig from '@/../site.config'
import * as demo from '@/lib/demo.data'

export default function useBlockouts() {
  const { data: session } = useSession()

  const isDemo = session?.user?.id === siteConfig.demoUserId
  const { data, error, mutate } = useSWRImmutable<TDateISODate[]>(
    !isDemo && session?.user?.id ? `/api/sanity/user/${session?.user?.id}/blockouts` : null
  )

  if (isDemo) {
    return {
      data: demo.blockouts,
      error: null,
    }
  }

  return {
    data,
    error,
    mutate,
  }
}
