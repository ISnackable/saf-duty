import { useSession } from 'next-auth/react'
import useSWRImmutable from 'swr/immutable'

import { type Calendar as CalendarType } from '@/lib/sanity.queries'
import siteConfig from '@/../site.config'
import * as demo from '@/lib/demo.data'

export default function useCalendar() {
  const { data: session } = useSession()

  const isDemo = session?.user?.id === siteConfig.demoUserId

  const { data, error, isLoading } = useSWRImmutable<CalendarType[]>(
    isDemo ? `/api/sanity/calendar` : null
  )

  return {
    data: isDemo ? demo.calendar : data,
    isLoading: isDemo ? false : isLoading,
    error: isDemo ? null : error,
  }
}
