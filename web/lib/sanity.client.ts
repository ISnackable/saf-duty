import { createClient } from 'next-sanity'
import type { User } from 'next-auth'

import { apiVersion, dataset, projectId, useCdn } from './sanity.api'
import {
  getAllUsersQuery,
  getUserQuery,
  getUserUpcomingDutiesQuery,
  type Calendar,
  getAllCalendarQuery,
  getUserBlockoutsQuery,
  type TDateISODate,
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

export async function getAllUsers(): Promise<User[]> {
  const users = await clientWithToken.fetch(getAllUsersQuery)
  return users
}

export async function getUserById(id: string): Promise<User> {
  const user = await clientWithToken.fetch(getUserQuery, { id })
  return user
}

export async function getUserUpcomingDuties(id?: string): Promise<TDateISODate[]> {
  if (!id) return []
  const result = await client.fetch(getUserUpcomingDutiesQuery, { id })
  return result
}

export async function getUserBlockouts(id?: string): Promise<TDateISODate[]> {
  if (!id) return []
  const result = await clientWithToken.fetch(getUserBlockoutsQuery, { id })
  return result
}

/**
 * @returns {Calendar[]} in descending order of creation date
 */
export async function getAllCalendar(): Promise<Calendar[]> {
  const calendar: Calendar[] = await clientWithToken.fetch(getAllCalendarQuery)

  return calendar
}
