import { createClient } from 'next-sanity'
import type { User } from 'next-auth'

import { apiVersion, dataset, projectId, useCdn } from './sanity.api'
import {
  getAllUsersQuery,
  getCalendarQuery,
  getUserQuery,
  getUserUpcomingDutiesQuery,
  type UpcomingDuties,
  type Calendar,
  getAllCalendarQuery,
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

export async function getUserUpcomingDuties(id?: string): Promise<UpcomingDuties> {
  if (!id) return []
  const result = await client.fetch(getUserUpcomingDutiesQuery, { id })
  return result
}

/**
 * @returns {Calendar[]} in descending order of creation date
 */
export async function getAllCalendar(): Promise<Calendar[]> {
  const calendar: Calendar[] = await clientWithToken.fetch(getAllCalendarQuery)

  // convert calendar date string to Date object
  calendar.forEach((c) => {
    c.date = new Date(c.date)
    c.roster.forEach((r) => {
      r.date = new Date(r.date)
    })
  })

  return calendar
}

export async function getCalendarById(id: string): Promise<Calendar> {
  const calendar: Calendar = await clientWithToken.fetch(getCalendarQuery, { id })

  // convert calendar date string to Date object
  calendar.date = new Date(calendar.date)
  calendar.roster.forEach((r) => {
    r.date = new Date(r.date)
  })

  return calendar
}
