import { groq } from 'next-sanity'

export const getAllUsersQuery = groq`*[_type == "user"]{
    name,
    image,
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
    enlistment,
    "upcomingDuties": *[_type == 'calendar']{
        roster[dutyPersonnel._ref == $id]{date, dutyPersonnel->{name}}
    }.roster[]
}`

export const getUserUpcomingDutiesQuery = groq`*[_type == 'calendar']{
    roster[dutyPersonnel._ref == $id]{date, dutyPersonnel->{name}}
}.roster[]
`
