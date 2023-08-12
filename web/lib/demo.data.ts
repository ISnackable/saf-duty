// All the demo data that used as fallbacks when there's nothing in the dataset yet

import type { AllSanityUser, Calendar, SanitySwapRequest, TDateISODate } from './sanity.queries'
import { Role } from '@/nextauth.d'

const todayMonth = (new Date().getMonth() + 1).toString().padStart(2, '0') as `${number}${number}`

export const title = 'Blog.'

export const description = 'Example description.'

export const users: AllSanityUser[] = [
  {
    id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
    name: 'demo',
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
    maxBlockouts: 12,
  },
  {
    id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
    name: 'Zhi Hao',
    role: Role.user,
    image:
      'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment: '2022-02-27',
    ord: '2024-02-28',
    totalDutyDone: 12,
    weekdayPoints: 0,
    weekendPoints: 1,
    extra: 0,
    blockouts: ['2024-02-13'],
    maxBlockouts: 12,
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
    maxBlockouts: 12,
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
    maxBlockouts: 12,
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
    maxBlockouts: 12,
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
    maxBlockouts: 12,
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
    maxBlockouts: 12,
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
    maxBlockouts: 12,
  },
]

export const blockouts: TDateISODate[] = [
  `2023-${todayMonth}-04`,
  `2023-${todayMonth}-15`,
  `2023-${todayMonth}-19`,
  `2023-${todayMonth}-24`,
]

export const upcomingDuties: TDateISODate[] = [
  `2023-${todayMonth}-03`,
  `2023-${todayMonth}-13`,
  `2023-${todayMonth}-26`,
  `2023-${todayMonth}-28`,
]

export const calendar: Calendar[] = [
  {
    date: `2023-${todayMonth}-01`,
    roster: [
      {
        date: `2023-${todayMonth}-01`,
        personnel: 'Jun Kai',
        standby: 'demo',
      },
      {
        date: `2023-${todayMonth}-02`,
        personnel: 'Zhi Hao',
        standby: 'Darryl Koh',
      },
      {
        date: `2023-${todayMonth}-03`,
        personnel: 'demo',
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
        standby: 'demo',
      },
      {
        date: `2023-${todayMonth}-12`,
        personnel: 'Wang Li',
        standby: 'Zhi Hao',
      },
      {
        date: `2023-${todayMonth}-13`,
        personnel: 'demo',
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
        standby: 'demo',
      },
      {
        date: `2023-${todayMonth}-25`,
        personnel: 'Jia Hao',
        standby: 'Darryl Koh',
      },
      {
        date: `2023-${todayMonth}-26`,
        personnel: 'demo',
        standby: 'Jia Hui',
      },
      {
        date: `2023-${todayMonth}-27`,
        personnel: 'Jia Hao',
        standby: 'Zhi Hao',
      },
      {
        date: `2023-${todayMonth}-28`,
        personnel: 'demo',
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
        standby: 'demo',
      },
    ],
  },
  // {
  //   date: `2023-05-01`,
  //   roster: [
  //     {
  //       date: `2023-05-01`,
  //       personnel: 'Jun Kai',
  //       standby: 'demo',
  //     },
  //     {
  //       date: `2023-05-02`,
  //       personnel: 'Zhi Hao',
  //       standby: 'Darryl Koh',
  //     },
  //     {
  //       date: `2023-05-03`,
  //       personnel: 'demo',
  //       standby: 'Jia Hao',
  //     },
  //     {
  //       date: `2023-05-04`,
  //       personnel: 'Elliot Tan',
  //       standby: 'Wang Li',
  //     },
  //     {
  //       date: `2023-05-05`,
  //       personnel: 'Jun Kai',
  //       standby: 'Jia Hui',
  //     },
  //     {
  //       date: `2023-05-06`,
  //       personnel: 'Darryl Koh',
  //       standby: 'Zhi Hao',
  //     },
  //     {
  //       date: `2023-05-07`,
  //       personnel: 'Wang Li',
  //       standby: 'Jun Kai',
  //     },
  //     {
  //       date: `2023-05-08`,
  //       personnel: 'Jia Hui',
  //       standby: 'Elliot Tan',
  //     },
  //     {
  //       date: `2023-05-09`,
  //       personnel: 'Zhi Hao',
  //       standby: 'Jia Hao',
  //     },
  //     {
  //       date: `2023-05-10`,
  //       personnel: 'Elliot Tan',
  //       standby: 'Jun Kai',
  //     },
  //     {
  //       date: `2023-05-11`,
  //       personnel: 'Darryl Koh',
  //       standby: 'demo',
  //     },
  //     {
  //       date: `2023-05-12`,
  //       personnel: 'Wang Li',
  //       standby: 'Zhi Hao',
  //     },
  //     {
  //       date: `2023-05-13`,
  //       personnel: 'demo',
  //       standby: 'Elliot Tan',
  //     },
  //     {
  //       date: `2023-05-14`,
  //       personnel: 'Jun Kai',
  //       standby: 'Wang Li',
  //     },
  //     {
  //       date: `2023-05-15`,
  //       personnel: 'Darryl Koh',
  //       standby: 'Jia Hui',
  //     },
  //     {
  //       date: `2023-05-16`,
  //       personnel: 'Elliot Tan',
  //       standby: 'Wang Li',
  //     },
  //     {
  //       date: `2023-05-17`,
  //       personnel: 'Jia Hui',
  //       standby: 'Darryl Koh',
  //     },
  //     {
  //       date: `2023-05-18`,
  //       personnel: 'Zhi Hao',
  //       standby: 'Elliot Tan',
  //     },
  //     {
  //       date: `2023-05-19`,
  //       personnel: 'Jia Hui',
  //       standby: 'Jun Kai',
  //     },
  //     {
  //       date: `2023-05-20`,
  //       personnel: 'Wang Li',
  //       standby: 'Jia Hao',
  //     },
  //     {
  //       date: `2023-05-21`,
  //       personnel: 'Zhi Hao',
  //       standby: 'Darryl Koh',
  //     },
  //     {
  //       date: `2023-05-22`,
  //       personnel: 'Jia Hao',
  //       standby: 'Jia Hui',
  //     },
  //     {
  //       date: `2023-05-23`,
  //       personnel: 'Darryl Koh',
  //       standby: 'Zhi Hao',
  //     },
  //     {
  //       date: `2023-05-24`,
  //       personnel: 'Wang Li',
  //       standby: 'demo',
  //     },
  //     {
  //       date: `2023-05-25`,
  //       personnel: 'Jia Hao',
  //       standby: 'Darryl Koh',
  //     },
  //     {
  //       date: `2023-05-26`,
  //       personnel: 'demo',
  //       standby: 'Jia Hui',
  //     },
  //     {
  //       date: `2023-05-27`,
  //       personnel: 'Jia Hao',
  //       standby: 'Zhi Hao',
  //     },
  //     {
  //       date: `2023-05-28`,
  //       personnel: 'demo',
  //       standby: 'Wang Li',
  //     },
  //     {
  //       date: `2023-05-29`,
  //       personnel: 'Jun Kai',
  //       standby: 'Elliot Tan',
  //     },
  //     {
  //       date: `2023-05-30`,
  //       personnel: 'Jia Hui',
  //       standby: 'Jia Hao',
  //     },
  //     {
  //       date: `2023-05-31`,
  //       personnel: 'Elliot Tan',
  //       standby: 'demo',
  //     },
  //   ],
  // },
]

export const swapRecords: SanitySwapRequest[] = [
  {
    _updatedAt: '2023-04-15',
    reason: 'abcdefgwdawdawdawdawdad',
    _type: 'swapRequest',
    status: 'pending',
    calendar: {
      id: 'calendar-2023-03-01',
      date: '2023-03-01',
    },
    receiver: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      image:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    receiverDate: '2023-03-27',
    _id: '9c23238b-0f67-43f2-a281-7e3167c92680',
    requester: {
      id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
      name: 'demo',
      image:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    _rev: 't2rWJTAb4uNhnFji5txjM4',
    requesterDate: '2023-03-04',
    _createdAt: '2023-04-14',
  },
  {
    receiver: {
      id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
      name: 'demo',
      image:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    _rev: '1gKhFzwtTHqc5n8Z8BZVx6',
    _createdAt: '2023-04-15',
    _type: 'swapRequest',
    calendar: {
      id: 'calendar-2023-03-01',
      date: '2023-03-01',
    },
    requester: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      image:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reason: 'abcdefg',
    requesterDate: '2023-03-27',
    _id: 'f7b62509-b55c-4d69-8fbb-7268fa792c30',
    _updatedAt: '2023-04-15',
    receiverDate: '2023-03-21',
    status: 'pending',
  },
  {
    _type: 'swapRequest',
    receiver: {
      id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
      name: 'demo',
      image:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    receiverDate: '2023-03-10',
    _id: 'f86b497e-adea-458d-a028-807e0d9395a1',
    calendar: {
      id: 'calendar-2023-03-01',
      date: '2023-03-01',
    },
    requester: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      image:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reason: 'a',
    requesterDate: '2023-03-20',
    status: 'pending',
    _createdAt: '2023-04-15',
    _rev: 'f5T2DmY3fkMt6I6qKjOpiP',
    _updatedAt: '2023-04-15',
  },
]
