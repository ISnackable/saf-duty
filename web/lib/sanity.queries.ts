import { groq } from 'next-sanity'
import config from '@/../site.config'

export interface Calendar {
  date: Date
  roster: Roster[]
}

export interface Roster {
  date: Date
  personnel: string
  standby: string
}

export type UpcomingDuties = string[]

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
    enlistment
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
    enlistment
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

export const getCalendarQuery = groq`*[_type == 'calendar' && _id == $id]{
  date,
  roster[]{
    date,
    "personnel": dutyPersonnel->{name}.name,
    "standby": dutyPersonnelStandIn->{name}.name
  }
}[0]`
