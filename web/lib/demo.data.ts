// All the demo data that used as fallbacks when there's nothing in the dataset yet

import type { User } from 'next-auth'
import { Role } from '@/nextauth.d'
import { Calendar } from './sanity.queries'

const todayMonth = (new Date().getMonth() + 1).toString().padStart(2, '0') as `${number}${number}`

export const title = 'Blog.'

export const description = 'Example description.'

export const users: User[] = [
  {
    id: '5eda9aac-bfc1-11ed-afa1-0242ac120002',
    name: 'Jun Jie',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment: '2022-01-02',
    ord: '2024-01-01',
    totalDutyDone: 10,
    weekdayPoints: 0,
    weekendPoints: 2,
    extra: 0,
    blockouts: ['2024-02-04'],
  },
  {
    id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
    name: 'Zhi Hao',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment: '2022-02-29',
    ord: '2024-02-28',
    totalDutyDone: 12,
    weekdayPoints: 0,
    weekendPoints: 1,
    extra: 0,
    blockouts: ['2024-02-13'],
  },
  {
    id: '5edaa132-bfc1-11ed-afa1-0242ac120002',
    name: 'Jia Hui',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment: '2023-05-11',
    ord: '2025-05-10',
    totalDutyDone: 10,
    weekdayPoints: 1,
    weekendPoints: 1,
    extra: 2,
    blockouts: [],
  },
  {
    id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002',
    name: 'Jia Hao',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment: '2021-03-02',
    ord: '2023-03-01',
    totalDutyDone: 9,
    weekdayPoints: 1,
    weekendPoints: 1,
    extra: 0,
    blockouts: [],
  },
  {
    id: '5edaa416-bfc1-11ed-afa1-0242ac120002',
    name: 'Jun Kai',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment: '2022-04-02',
    ord: '2024-04-01',
    totalDutyDone: 6,
    weekdayPoints: 1,
    weekendPoints: 0,
    extra: 0,
    blockouts: [
      '2024-02-10',
      '2024-02-11',
      '2024-02-12',
      '2024-02-13',
      '2024-02-14',
      '2024-02-15',
      '2024-02-16',
      '2024-02-17',
      '2024-02-18',
    ],
  },
  {
    id: '78c9dc16-bfc1-11ed-afa1-0242ac120002',
    name: 'Wang Li',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment: '2022-09-30',
    ord: '2024-09-29',
    totalDutyDone: 0,
    weekdayPoints: -1,
    weekendPoints: 2,
    extra: 0,
    blockouts: ['2024-02-01', '2024-02-27'],
  },
  {
    id: '9d658fae-c343-11ed-afa1-0242ac120002',
    name: 'Darryl Koh',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1531727991582-cfd25ce79613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    enlistment: '2022-02-14',
    ord: '2024-02-13',
    totalDutyDone: 0,
    weekdayPoints: 1,
    weekendPoints: 2,
    extra: 0,
    blockouts: [
      '2024-02-01',
      '2024-02-02',
      '2024-02-03',
      '2024-02-04',
      '2024-02-05',
      '2024-02-06',
      '2024-02-07',
      '2024-02-08',
      '2024-02-09',
      '2024-02-10',
      '2024-02-11',
      '2024-02-12',
      '2024-02-13',
      '2024-02-14',
      '2024-02-15',
      '2024-02-16',
    ],
  },
  {
    id: 'a1196c88-c343-11ed-afa1-0242ac120002',
    name: 'Elliot Tan',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1614587185092-af24ed71c6e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    enlistment: '2022-06-24',
    ord: '2024-06-23',
    totalDutyDone: 0,
    weekdayPoints: 0,
    weekendPoints: 0,
    extra: 0,
    blockouts: [
      '2024-02-01',
      '2024-02-02',
      '2024-02-03',
      '2024-02-04',
      '2024-02-05',
      '2024-02-06',
      '2024-02-07',
      '2024-02-08',
      '2024-02-09',
      '2024-02-10',
      '2024-02-11',
      '2024-02-12',
      '2024-02-18',
      '2024-02-25',
    ],
  },
]

export const blockouts = [
  `2023-${todayMonth}-15`,
  `2023-${todayMonth}-13`,
  `2023-${todayMonth}-19`,
  `2023-${todayMonth}-04`,
]

export const upcomingDuties = [
  `2023-${todayMonth}-05`,
  `2023-${todayMonth}-12`,
  `2023-${todayMonth}-17`,
  `2023-${todayMonth}-23`,
]

export const calendar: Calendar[] = [
  {
    date: `2023-${todayMonth}-01`,
    roster: [
      {
        date: `2023-${todayMonth}-01`,
        personnel: 'Jun Kai',
        standby: 'Jun Jie',
      },
      {
        date: `2023-${todayMonth}-02`,
        personnel: 'Zhi Hao',
        standby: 'Darryl Koh',
      },
      {
        date: `2023-${todayMonth}-03`,
        personnel: 'Jun Jie',
        standby: 'Jia Hao',
      },
      {
        date: `2023-${todayMonth}-04`,
        personnel: 'Elliot Tan',
        standby: 'Wang Li',
      },
      {
        date: `2023-${todayMonth}-05`,
        personnel: 'Jun Kai',
        standby: 'Jia Hui',
      },
      {
        date: `2023-${todayMonth}-06`,
        personnel: 'Darryl Koh',
        standby: 'Zhi Hao',
      },
      {
        date: `2023-${todayMonth}-07`,
        personnel: 'Wang Li',
        standby: 'Jun Kai',
      },
      {
        date: `2023-${todayMonth}-08`,
        personnel: 'Jia Hui',
        standby: 'Elliot Tan',
      },
      {
        date: `2023-${todayMonth}-09`,
        personnel: 'Zhi Hao',
        standby: 'Jia Hao',
      },
      {
        date: `2023-${todayMonth}-10`,
        personnel: 'Elliot Tan',
        standby: 'Jun Kai',
      },
      {
        date: `2023-${todayMonth}-11`,
        personnel: 'Darryl Koh',
        standby: 'Jun Jie',
      },
      {
        date: `2023-${todayMonth}-12`,
        personnel: 'Wang Li',
        standby: 'Zhi Hao',
      },
      {
        date: `2023-${todayMonth}-13`,
        personnel: 'Jun Jie',
        standby: 'Elliot Tan',
      },
      {
        date: `2023-${todayMonth}-14`,
        personnel: 'Jun Kai',
        standby: 'Wang Li',
      },
      {
        date: `2023-${todayMonth}-15`,
        personnel: 'Darryl Koh',
        standby: 'Jia Hui',
      },
      {
        date: `2023-${todayMonth}-16`,
        personnel: 'Elliot Tan',
        standby: 'Wang Li',
      },
      {
        date: `2023-${todayMonth}-17`,
        personnel: 'Jia Hui',
        standby: 'Darryl Koh',
      },
      {
        date: `2023-${todayMonth}-18`,
        personnel: 'Zhi Hao',
        standby: 'Elliot Tan',
      },
      {
        date: `2023-${todayMonth}-19`,
        personnel: 'Jia Hui',
        standby: 'Jun Kai',
      },
      {
        date: `2023-${todayMonth}-20`,
        personnel: 'Wang Li',
        standby: 'Jia Hao',
      },
      {
        date: `2023-${todayMonth}-21`,
        personnel: 'Zhi Hao',
        standby: 'Darryl Koh',
      },
      {
        date: `2023-${todayMonth}-22`,
        personnel: 'Jia Hao',
        standby: 'Jia Hui',
      },
      {
        date: `2023-${todayMonth}-23`,
        personnel: 'Darryl Koh',
        standby: 'Zhi Hao',
      },
      {
        date: `2023-${todayMonth}-24`,
        personnel: 'Wang Li',
        standby: 'Jun Jie',
      },
      {
        date: `2023-${todayMonth}-25`,
        personnel: 'Jia Hao',
        standby: 'Darryl Koh',
      },
      {
        date: `2023-${todayMonth}-26`,
        personnel: 'Jun Jie',
        standby: 'Jia Hui',
      },
      {
        date: `2023-${todayMonth}-27`,
        personnel: 'Jia Hao',
        standby: 'Zhi Hao',
      },
      {
        date: `2023-${todayMonth}-28`,
        personnel: 'Jun Jie',
        standby: 'Wang Li',
      },
      {
        date: `2023-${todayMonth}-29`,
        personnel: 'Jun Kai',
        standby: 'Elliot Tan',
      },
      {
        date: `2023-${todayMonth}-30`,
        personnel: 'Jia Hui',
        standby: 'Jia Hao',
      },
      {
        date: `2023-${todayMonth}-31`,
        personnel: 'Elliot Tan',
        standby: 'Jun Jie',
      },
    ],
  },
]
