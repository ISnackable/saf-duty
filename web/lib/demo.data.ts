// All the demo data that used as fallbacks when there's nothing in the dataset yet

import type { User } from 'next-auth'
import { Role } from '@/nextauth.d'
import { Calendar } from './sanity.queries'

const todayMonth = ('0' + (new Date().getMonth() + 1)).slice(-2)

export const title = 'Blog.'

export const description = 'Example description.'

export const users: User[] = [
  {
    id: '5eda9aac-bfc1-11ed-afa1-0242ac120002',
    name: 'Jun Jie',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment: new Date(2022, 1, 2),
    ord: new Date(2024, 1, 1),
    totalDutyDone: 10,
    weekdayPoints: 0,
    weekendPoints: 2,
    extra: 0,
    blockouts: [new Date(2024, 2, 4)],
  },
  {
    id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
    name: 'Zhi Hao',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment: new Date(2022, 2, 29),
    ord: new Date(2024, 2, 28),
    totalDutyDone: 12,
    weekdayPoints: 0,
    weekendPoints: 1,
    extra: 0,
    blockouts: [new Date(2024, 2, 13)],
  },
  {
    id: '5edaa132-bfc1-11ed-afa1-0242ac120002',
    name: 'Jia Hui',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment: new Date(2023, 5, 11),
    ord: new Date(2025, 5, 10),
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
    enlistment: new Date(2021, 3, 2),
    ord: new Date(2023, 3, 1),
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
    enlistment: new Date(2022, 4, 2),
    ord: new Date(2024, 4, 1),
    totalDutyDone: 6,
    weekdayPoints: 1,
    weekendPoints: 0,
    extra: 0,
    blockouts: [
      new Date(2024, 2, 10),
      new Date(2024, 2, 11),
      new Date(2024, 2, 12),
      new Date(2024, 2, 13),
      new Date(2024, 2, 14),
      new Date(2024, 2, 15),
      new Date(2024, 2, 16),
      new Date(2024, 2, 17),
      new Date(2024, 2, 18),
    ],
  },
  {
    id: '78c9dc16-bfc1-11ed-afa1-0242ac120002',
    name: 'Wang Li',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment: new Date(2022, 9, 30),
    ord: new Date(2024, 9, 29),
    totalDutyDone: 0,
    weekdayPoints: -1,
    weekendPoints: 2,
    extra: 0,
    blockouts: [new Date(2024, 2, 1), new Date(2024, 2, 27)],
  },
  {
    id: '9d658fae-c343-11ed-afa1-0242ac120002',
    name: 'Darryl Koh',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1531727991582-cfd25ce79613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    enlistment: new Date(2022, 2, 14),
    ord: new Date(2024, 2, 13),
    totalDutyDone: 0,
    weekdayPoints: 1,
    weekendPoints: 2,
    extra: 0,
    blockouts: [
      new Date(2024, 2, 1),
      new Date(2024, 2, 2),
      new Date(2024, 2, 3),
      new Date(2024, 2, 4),
      new Date(2024, 2, 5),
      new Date(2024, 2, 6),
      new Date(2024, 2, 7),
      new Date(2024, 2, 8),
      new Date(2024, 2, 9),
      new Date(2024, 2, 10),
      new Date(2024, 2, 11),
      new Date(2024, 2, 12),
      new Date(2024, 2, 13),
      new Date(2024, 2, 14),
      new Date(2024, 2, 15),
      new Date(2024, 2, 16),
    ],
  },
  {
    id: 'a1196c88-c343-11ed-afa1-0242ac120002',
    name: 'Elliot Tan',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1614587185092-af24ed71c6e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    enlistment: new Date(2022, 6, 24),
    ord: new Date(2024, 6, 23),
    totalDutyDone: 0,
    weekdayPoints: 0,
    weekendPoints: 0,
    extra: 0,
    blockouts: [
      new Date(2024, 2, 1),
      new Date(2024, 2, 2),
      new Date(2024, 2, 3),
      new Date(2024, 2, 4),
      new Date(2024, 2, 5),
      new Date(2024, 2, 6),
      new Date(2024, 2, 7),
      new Date(2024, 2, 8),
      new Date(2024, 2, 9),
      new Date(2024, 2, 10),
      new Date(2024, 2, 11),
      new Date(2024, 2, 12),
      new Date(2024, 2, 18),
      new Date(2024, 2, 25),
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
    date: new Date(`2023-${todayMonth}-01`),
    roster: [
      {
        date: new Date(`2023-${todayMonth}-01`),
        personnel: 'Jun Kai',
        standby: 'Jun Jie',
      },
      {
        date: new Date(`2023-${todayMonth}-02`),
        personnel: 'Zhi Hao',
        standby: 'Darryl Koh',
      },
      {
        date: new Date(`2023-${todayMonth}-03`),
        personnel: 'Jun Jie',
        standby: 'Jia Hao',
      },
      {
        date: new Date(`2023-${todayMonth}-04`),
        personnel: 'Elliot Tan',
        standby: 'Wang Li',
      },
      {
        date: new Date(`2023-${todayMonth}-05`),
        personnel: 'Jun Kai',
        standby: 'Jia Hui',
      },
      {
        date: new Date(`2023-${todayMonth}-06`),
        personnel: 'Darryl Koh',
        standby: 'Zhi Hao',
      },
      {
        date: new Date(`2023-${todayMonth}-07`),
        personnel: 'Wang Li',
        standby: 'Jun Kai',
      },
      {
        date: new Date(`2023-${todayMonth}-08`),
        personnel: 'Jia Hui',
        standby: 'Elliot Tan',
      },
      {
        date: new Date(`2023-${todayMonth}-09`),
        personnel: 'Zhi Hao',
        standby: 'Jia Hao',
      },
      {
        date: new Date(`2023-${todayMonth}-10`),
        personnel: 'Elliot Tan',
        standby: 'Jun Kai',
      },
      {
        date: new Date(`2023-${todayMonth}-11`),
        personnel: 'Darryl Koh',
        standby: 'Jun Jie',
      },
      {
        date: new Date(`2023-${todayMonth}-12`),
        personnel: 'Wang Li',
        standby: 'Zhi Hao',
      },
      {
        date: new Date(`2023-${todayMonth}-13`),
        personnel: 'Jun Jie',
        standby: 'Elliot Tan',
      },
      {
        date: new Date(`2023-${todayMonth}-14`),
        personnel: 'Jun Kai',
        standby: 'Wang Li',
      },
      {
        date: new Date(`2023-${todayMonth}-15`),
        personnel: 'Darryl Koh',
        standby: 'Jia Hui',
      },
      {
        date: new Date(`2023-${todayMonth}-16`),
        personnel: 'Elliot Tan',
        standby: 'Wang Li',
      },
      {
        date: new Date(`2023-${todayMonth}-17`),
        personnel: 'Jia Hui',
        standby: 'Darryl Koh',
      },
      {
        date: new Date(`2023-${todayMonth}-18`),
        personnel: 'Zhi Hao',
        standby: 'Elliot Tan',
      },
      {
        date: new Date(`2023-${todayMonth}-19`),
        personnel: 'Jia Hui',
        standby: 'Jun Kai',
      },
      {
        date: new Date(`2023-${todayMonth}-20`),
        personnel: 'Wang Li',
        standby: 'Jia Hao',
      },
      {
        date: new Date(`2023-${todayMonth}-21`),
        personnel: 'Zhi Hao',
        standby: 'Darryl Koh',
      },
      {
        date: new Date(`2023-${todayMonth}-22`),
        personnel: 'Jia Hao',
        standby: 'Jia Hui',
      },
      {
        date: new Date(`2023-${todayMonth}-23`),
        personnel: 'Darryl Koh',
        standby: 'Zhi Hao',
      },
      {
        date: new Date(`2023-${todayMonth}-24`),
        personnel: 'Wang Li',
        standby: 'Jun Jie',
      },
      {
        date: new Date(`2023-${todayMonth}-25`),
        personnel: 'Jia Hao',
        standby: 'Darryl Koh',
      },
      {
        date: new Date(`2023-${todayMonth}-26`),
        personnel: 'Jun Jie',
        standby: 'Jia Hui',
      },
      {
        date: new Date(`2023-${todayMonth}-27`),
        personnel: 'Jia Hao',
        standby: 'Zhi Hao',
      },
      {
        date: new Date(`2023-${todayMonth}-28`),
        personnel: 'Jun Jie',
        standby: 'Wang Li',
      },
      {
        date: new Date(`2023-${todayMonth}-29`),
        personnel: 'Jun Kai',
        standby: 'Elliot Tan',
      },
      {
        date: new Date(`2023-${todayMonth}-30`),
        personnel: 'Jia Hui',
        standby: 'Jia Hao',
      },
      {
        date: new Date(`2023-${todayMonth}-31`),
        personnel: 'Elliot Tan',
        standby: 'Jun Jie',
      },
    ],
  },
]
