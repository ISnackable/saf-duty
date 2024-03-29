import { useSession } from 'next-auth/react'
import useSWR from 'swr'

import { type AllSanityUser } from '@/lib/sanity.queries'
import siteConfig from '@/../site.config'
import * as demo from '@/lib/demo.data'

export default function useUsers() {
  const { data: session } = useSession()

  const isDemo = session?.user?.id === siteConfig.demoUserId

  const { data, error, isLoading, mutate } = useSWR<AllSanityUser[]>(
    !isDemo && session?.user?.unit ? `/api/sanity/users` : null,
  )

  if (isDemo) {
    return {
      data: demo.users,
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
