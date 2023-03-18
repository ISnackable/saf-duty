import type { User } from 'next-auth'
import { groq } from 'next-sanity'

export interface Calendar {
  date?: number
  roster?: Roster[]
}

export interface Roster {
  _key: string
  date?: number
  dutyPersonnel?: User
  dutyPersonnelStandIn?: User
}

export type UpcomingDuties = string[]

export const getAllUsersQuery = groq`*[_type == "user"]{
    name,
    image,
    role,
    blockouts,
    weekdayPoints,
    weekendPoints,
    extra,
    ord,
    enlistment
}`

export const getUserQuery = groq`*[_type == "user" && _id == $id]{
    name,
    image,
    blockouts,
    weekdayPoints,
    weekendPoints,
    extra,
    ord,
    enlistment
}`

export const getUserUpcomingDutiesQuery = groq`*[_type == 'calendar']{
    roster[dutyPersonnel._ref == $id]{date}
}.roster[].date
`

export const getCalendarQuery = groq`*[_type == "calendar"]{
    date,
    roster
}`
