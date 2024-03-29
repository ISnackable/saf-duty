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
  id: string
  date: TDateISODate
  roster: Roster[]
}

export interface Roster {
  date: TDateISODate
  isExtra: boolean
  personnel: Pick<SanityUser, 'id' | 'name'>
  standby: Pick<SanityUser, 'id' | 'name'>
}

export interface Unit {
  id: string
  unitCode: string
}

export interface SanityUser extends User {
  id: string
  name: string
  email: string
  image: string
  role?: Role
  unit: string
  blockouts?: TDateISODate[]
  weekdayPoints: number
  weekendPoints: number
  extra: number
  maxBlockouts: number
  ord?: TDateISODate
  enlistment?: TDateISODate
  totalDutyDone?: number
}

export type AllSanityUser = Omit<SanityUser, 'email'>

export interface SanityUserBlockouts {
  maxBlockouts: number
  blockouts: TDateISODate[]
}

export interface SanityReference {
  _ref: string
  _type?: 'reference'
  _weak?: boolean
}

export interface SanitySwapRequest {
  _createdAt: TDateISODate
  _id: string
  _rev: string
  _type: string
  _updatedAt: TDateISODate
  calendar: {
    id: string
    date: TDateISODate
  }
  reason?: string
  receiver: Pick<SanityUser, 'id' | 'name' | 'image'>
  receiverDate: TDateISODate
  requester: Pick<SanityUser, 'id' | 'name' | 'image'>
  requesterDate: TDateISODate
  status: 'pending' | 'approved' | 'declined'
}

export const getUserByEmailQuery = groq`*[_type == $userSchema && email == $email][0]{
  ...,
  "unit": unit->unitCode
}`

export const getAllUnitsQuery = groq`*[_type == "unit"]{
  "id": _id,
  unitCode
}`

// Get all calendar roster that is related to the given user id and is created within the last 30 days
export const getUserUpcomingDutiesQuery = groq`*[_type == 'calendar' && date >= $firstDay && date <= $lastDay && !(_id in path("drafts.**"))]{
    roster[dutyPersonnel._ref == $id]{date}
}.roster[].date`

export const getAllUsersQuery = groq`*[_type == "user" && _id != "${config.demoUserId}" && unit->unitCode == $unit && !(_id in path("drafts.**"))]{
  "id": _id,
  name,
  image,
  role,
  "unit": unit->unitCode,
  blockouts,
  weekdayPoints,
  weekendPoints,
  extra,
  maxBlockouts,
  ord,
  enlistment,
  "totalDutyDone": count(*[_type == 'calendar' && references(^._id)].roster[^._id == dutyPersonnel._ref])
}`

export const getUserQuery = groq`*[_type == "user" && _id == $id && !(_id in path("drafts.**"))]{
  "id": _id,
  name,
  email,
  role,
  "unit": unit->unitCode,
  image,
  blockouts,
  weekdayPoints,
  weekendPoints,
  extra,
  ord,
  enlistment,
  "totalDutyDone": count(*[_type == 'calendar' && references($id)].roster[$id == dutyPersonnel._ref])
}[0]`

export const getUserBlockoutsQuery = groq`*[_type == "user" && _id == $id && !(_id in path("drafts.**"))]{
    maxBlockouts,
    blockouts
}[0]`

export const getAllUserCalendarQuery = groq`*[_type == 'calendar' && references($id) && !(_id in path("drafts.**"))]{
  "id": _id,
  date,
  roster[]{
    date,
    isExtra,
    "personnel": dutyPersonnel->{
      "id": _id,
      name
    },
    "standby": dutyPersonnelStandIn->{
      "id": _id,
      name
    }
  }
}|order(date desc)[0..5]`

export const getCalendarQuery = groq`*[_type == 'calendar' && _id == $id && !(_id in path("drafts.**"))]{
  "id": _id,
  date,
  roster[]{
    date,
    isExtra,
    "personnel": dutyPersonnel->{
      "id": _id,
      name
    },
    "standby": dutyPersonnelStandIn->{
      "id": _id,
      name
    }
  }
}[0]`

export const getUserSwapRequestQuery = groq`*[_type == "swapRequest" && references($id)]{
  ...,
  calendar->{
    "id": _id,
    date,
    isExtra
  },
  "receiver": receiver->{
    "id": _id,
    name,
    image
  },
  "requester": requester->{
    "id": _id,
    name,
    image
  }
}`

// export const getUserPushSubscriptionQuery = groq`*[_type == "user" && _id == $id && !(_id in path("drafts.**"))]{
//   pushSubscription
// }[0].pushSubscription`
