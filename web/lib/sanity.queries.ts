import { groq } from 'next-sanity'
import config from '@/../site.config'
import type { User } from 'next-auth'
import type { Role } from '@/nextauth'

type TYear = `${number}${number}${number}${number}`
type TMonth = `${number}${number}`
type TDay = `${number}${number}`

/**
 * Represent a string like `2021-01-08`
 */
export type TDateISODate = `${TYear}-${TMonth}-${TDay}`

export interface Calendar {
  date: TDateISODate
  roster: Roster[]
}

export interface Roster {
  date: TDateISODate
  personnel: string
  standby: string
}

export interface SanityUser extends User {
  id: string
  name: string
  email: string
  role?: Role
  image: string
  blockouts?: TDateISODate[]
  weekdayPoints: number
  weekendPoints: number
  extra: number
  ord?: TDateISODate
  enlistment?: TDateISODate
  totalDutyDone?: number
}

export type AllSanityUser = Omit<SanityUser, 'email'>

export const getAllUsersQuery = groq`*[_type == "user" && _id != "${config.demoUserId}" && !(_id in path("drafts.**"))]{
    "id": _id,
    name,
    image,
    role,
    blockouts,
    weekdayPoints,
    weekendPoints,
    extra,
    ord,
    enlistment,
    totalDutyDone
}`

export const getUserQuery = groq`*[_type == "user" && _id == $id && !(_id in path("drafts.**"))]{
    "id": _id,
    name,
    email,
    role,
    image,
    blockouts,
    weekdayPoints,
    weekendPoints,
    extra,
    ord,
    enlistment,
    totalDutyDone
}[0]`

export const getUserUpcomingDutiesQuery = groq`*[_type == 'calendar' && !(_id in path("drafts.**"))]{
    roster[dutyPersonnel._ref == $id]{date}
}.roster[].date
`

export const getUserBlockoutsQuery = groq`*[_type == "user" && _id == $id && !(_id in path("drafts.**"))]{
    blockouts
}[0].blockouts`

export const getAllCalendarQuery = groq`*[_type == 'calendar' && !(_id in path("drafts.**"))]{
  date,
  roster[]{
    date,
    "personnel": dutyPersonnel->{name}.name,
    "standby": dutyPersonnelStandIn->{name}.name
  }
}|order(_createdAt desc)[0..5]`
