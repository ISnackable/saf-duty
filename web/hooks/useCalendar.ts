import { useSession } from 'next-auth/react'
import useSWR from 'swr'

import { type Calendar as CalendarType } from '@/lib/sanity.queries'
import siteConfig from '@/../site.config'
import * as demo from '@/lib/demo.data'

export default function useCalendar() {
  const { data: session } = useSession()

  const isDemo = session?.user?.id === siteConfig.demoUserId

  const { data, error, isLoading } = useSWR<CalendarType[]>(!isDemo ? `/api/sanity/calendar` : null)

  if (isDemo) {
    return {
      data: demo.calendar,
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
