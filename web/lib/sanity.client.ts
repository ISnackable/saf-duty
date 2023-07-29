import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from './sanity.api'
import {
  getAllUsersQuery,
  getUserQuery,
  getUserUpcomingDutiesQuery,
  type Unit,
  type Calendar,
  getAllCalendarQuery,
  getUserBlockoutsQuery,
  type AllSanityUser,
  type TDateISODate,
  type SanityUser,
  getAllUnitsQuery,
  type SanityUserBlockouts,
  getUserSwapRequestQuery,
  type SanitySwapRequest,
  // getUserPushSubscriptionQuery,
} from './sanity.queries'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
})

export const clientWithToken = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token: process.env.SANITY_API_TOKEN,
})

export async function getAllUnits(): Promise<Unit[]> {
  const result = await client.fetch(getAllUnitsQuery)
  return result
}

export async function getAllUsers(unit: string): Promise<AllSanityUser[]> {
  const users = await clientWithToken.fetch(getAllUsersQuery, { unit })
  return users
}

export async function getUserById(id: string): Promise<SanityUser> {
  const user = await clientWithToken.fetch(getUserQuery, { id })
  return user
}

export async function getUserUpcomingDuties(id: string): Promise<TDateISODate[]> {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('sv-SE')
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toLocaleDateString('sv-SE')

  const result = await client.fetch(getUserUpcomingDutiesQuery, { id, firstDay, lastDay })
  return result
}

export async function getUserBlockouts(id: string): Promise<SanityUserBlockouts> {
  const result = await clientWithToken.fetch(getUserBlockoutsQuery, { id })
  return result
}

/**
 * @returns {Calendar[]} in descending order of creation date
 */
export async function getAllCalendar(id: string): Promise<Calendar[]> {
  const calendar: Calendar[] = await clientWithToken.fetch(getAllCalendarQuery, { id })

  return calendar
}

export async function getUserSwapRequest(id: string): Promise<SanitySwapRequest[]> {
  const result = await clientWithToken.fetch(getUserSwapRequestQuery, { id })
  return result
}

// export async function getUserPushSubscription(id: string): Promise<string> {
//   const result = await clientWithToken.fetch(getUserPushSubscriptionQuery, { id })
//   return result
// }
