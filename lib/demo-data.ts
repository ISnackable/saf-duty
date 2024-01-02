// All the demo data that used as fallbacks when there's nothing in the dataset yet
import { Tables } from '@/types/supabase';

const todayMonth = (new Date().getMonth() + 1)
  .toString()
  .padStart(2, '0') as `${number}${number}`;
const nextMonth = (new Date().getMonth() + 2)
  .toString()
  .padStart(2, '0') as `${number}${number}`;
const currentYear = new Date().getFullYear();

export const blockouts: string[] = [
  `${currentYear}-${todayMonth}-04`,
  `${currentYear}-${todayMonth}-15`,
  `${currentYear}-${todayMonth}-19`,
  `${currentYear}-${todayMonth}-24`,
  `${currentYear}-${nextMonth}-08`,
  `${currentYear}-${nextMonth}-12`,
  `${currentYear}-${nextMonth}-16`,
  `${currentYear}-${nextMonth}-18`,
  `${currentYear}-${nextMonth}-27`,
];

type DemoUsersType = Omit<Tables<'profiles'>, 'updated_at'>[];

export function isDemoUser(userId: string): boolean {
  return userId === demoUsers[0].id;
}

export const demoUsers: DemoUsersType = [
  {
    id: '047d19aa-487c-4dd1-8816-01db79956532',
    name: 'demo',
    role: 'user',
    unit_id: 1,
    avatar_url:
      'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment_date: '2022-01-02',
    ord_date: '2024-01-01',
    weekday_points: 0,
    weekend_points: 2,
    no_of_extras: 0,
    blockout_dates: blockouts,
    max_blockouts: 8,
  },
  {
    id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
    name: 'Zhi Hao',
    role: 'user',
    unit_id: 1,
    avatar_url:
      'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment_date: '2022-02-27',
    ord_date: '2024-02-28',
    // totalDutyDone: 12,
    weekday_points: 0,
    weekend_points: 1,
    no_of_extras: 0,
    blockout_dates: ['2024-02-13'],
    max_blockouts: 8,
  },
  {
    id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
    name: 'Jia Hui',
    role: 'user',
    unit_id: 1,
    avatar_url:
      'https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment_date: '${currentYear}-05-11',
    ord_date: '2025-05-10',
    // totalDutyDone: 10,
    weekday_points: 1,
    weekend_points: 1,
    no_of_extras: 2,
    blockout_dates: [],
    max_blockouts: 8,
  },
  {
    id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
    name: 'Jia Hao',
    role: 'user',
    unit_id: 1,
    avatar_url:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment_date: '2021-03-02',
    ord_date: '${currentYear}-03-01',
    // totalDutyDone: 9,
    weekday_points: 1,
    weekend_points: 1,
    no_of_extras: 0,
    blockout_dates: [],
    max_blockouts: 8,
  },
  {
    id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
    name: 'Jun Kai',
    role: 'user',
    unit_id: 1,
    avatar_url:
      'https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment_date: '2022-04-02',
    ord_date: '2024-04-01',
    // totalDutyDone: 6,
    weekday_points: 1,
    weekend_points: 0,
    no_of_extras: 0,
    blockout_dates: [
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
    max_blockouts: 8,
  },
  {
    id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
    name: 'Wang Li',
    role: 'user',
    unit_id: 1,
    avatar_url:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment_date: '2022-09-30',
    ord_date: '2024-09-29',
    // totalDutyDone: 0,
    weekday_points: -1,
    weekend_points: 2,
    no_of_extras: 0,
    blockout_dates: ['2024-02-01', '2024-02-27'],
    max_blockouts: 8,
  },
  {
    id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
    name: 'Darryl Koh',
    role: 'user',
    unit_id: 1,
    avatar_url:
      'https://images.unsplash.com/photo-1531727991582-cfd25ce79613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    enlistment_date: '2022-02-14',
    ord_date: '2024-02-13',
    // totalDutyDone: 0,
    weekday_points: 1,
    weekend_points: 2,
    no_of_extras: 0,
    blockout_dates: [
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
    max_blockouts: 8,
  },
  {
    id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
    name: 'Elliot Tan',
    role: 'user',
    unit_id: 1,
    avatar_url:
      'https://images.unsplash.com/photo-1614587185092-af24ed71c6e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    enlistment_date: '2022-06-24',
    ord_date: '2024-06-23',
    // totalDutyDone: 0,
    weekday_points: 0,
    weekend_points: 0,
    no_of_extras: 0,
    blockout_dates: [
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
    max_blockouts: 8,
  },
];

export const upcomingDuties: string[] = [
  `${currentYear}-${todayMonth}-03`,
  `${currentYear}-${todayMonth}-13`,
  `${currentYear}-${todayMonth}-26`,
  `${currentYear}-${todayMonth}-28`,
];

export const dutyRoster = [
  {
    id: 1,
    date: `${currentYear}-${todayMonth}-01`,
    roster: [
      {
        date: `${currentYear}-${todayMonth}-01`,
        isExtra: false,
        personnel: {
          id: '5edaa416-bfc1-11ed-afa1-0242ac120002',
          name: 'Jun Kai',
        },
        reserve_personnel: {
          id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
          name: 'demo',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-02`,
        isExtra: false,
        personnel: {
          id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
          name: 'Zhi Hao',
        },
        reserve_personnel: {
          id: '9d658fae-c343-11ed-afa1-0242ac120002',
          name: 'Darryl Koh',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-03`,
        isExtra: false,
        personnel: {
          id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
          name: 'demo',
        },
        reserve_personnel: {
          id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hao',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-04`,
        isExtra: false,
        personnel: {
          id: 'a1196c88-c343-11ed-afa1-0242ac120002',
          name: 'Elliot Tan',
        },
        reserve_personnel: {
          id: '78c9dc16-bfc1-11ed-afa1-0242ac120002',
          name: 'Wang Li',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-05`,
        isExtra: false,
        personnel: {
          id: '5edaa416-bfc1-11ed-afa1-0242ac120002',
          name: 'Jun Kai',
        },
        reserve_personnel: {
          id: '5edaa132-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hui',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-06`,
        isExtra: false,
        personnel: {
          id: '9d658fae-c343-11ed-afa1-0242ac120002',
          name: 'Darryl Koh',
        },
        reserve_personnel: {
          id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
          name: 'Zhi Hao',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-07`,
        isExtra: false,
        personnel: {
          id: '78c9dc16-bfc1-11ed-afa1-0242ac120002',
          name: 'Wang Li',
        },
        reserve_personnel: {
          id: '5edaa416-bfc1-11ed-afa1-0242ac120002',
          name: 'Jun Kai',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-08`,
        isExtra: false,
        personnel: {
          id: '5edaa132-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hui',
        },
        reserve_personnel: {
          id: 'a1196c88-c343-11ed-afa1-0242ac120002',
          name: 'Elliot Tan',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-09`,
        isExtra: false,
        personnel: {
          id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
          name: 'Zhi Hao',
        },
        reserve_personnel: {
          id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hao',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-10`,
        isExtra: false,
        personnel: {
          id: 'a1196c88-c343-11ed-afa1-0242ac120002',
          name: 'Elliot Tan',
        },
        reserve_personnel: {
          id: '5edaa416-bfc1-11ed-afa1-0242ac120002',
          name: 'Jun Kai',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-11`,
        isExtra: false,
        personnel: {
          id: '9d658fae-c343-11ed-afa1-0242ac120002',
          name: 'Darryl Koh',
        },
        reserve_personnel: {
          id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
          name: 'demo',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-12`,
        isExtra: false,
        personnel: {
          id: '78c9dc16-bfc1-11ed-afa1-0242ac120002',
          name: 'Wang Li',
        },
        reserve_personnel: {
          id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
          name: 'Zhi Hao',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-13`,
        isExtra: false,
        personnel: {
          id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
          name: 'demo',
        },
        reserve_personnel: {
          id: 'a1196c88-c343-11ed-afa1-0242ac120002',
          name: 'Elliot Tan',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-14`,
        isExtra: false,
        personnel: {
          id: '5edaa416-bfc1-11ed-afa1-0242ac120002',
          name: 'Jun Kai',
        },
        reserve_personnel: {
          id: '78c9dc16-bfc1-11ed-afa1-0242ac120002',
          name: 'Wang Li',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-15`,
        isExtra: false,
        personnel: {
          id: '9d658fae-c343-11ed-afa1-0242ac120002',
          name: 'Darryl Koh',
        },
        reserve_personnel: {
          id: '5edaa132-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hui',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-16`,
        isExtra: false,
        personnel: {
          id: 'a1196c88-c343-11ed-afa1-0242ac120002',
          name: 'Elliot Tan',
        },
        reserve_personnel: {
          id: '78c9dc16-bfc1-11ed-afa1-0242ac120002',
          name: 'Wang Li',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-17`,
        isExtra: false,
        personnel: {
          id: '5edaa132-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hui',
        },
        reserve_personnel: {
          id: '9d658fae-c343-11ed-afa1-0242ac120002',
          name: 'Darryl Koh',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-18`,
        isExtra: false,
        personnel: {
          id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
          name: 'Zhi Hao',
        },
        reserve_personnel: {
          id: 'a1196c88-c343-11ed-afa1-0242ac120002',
          name: 'Elliot Tan',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-19`,
        isExtra: false,
        personnel: {
          id: '5edaa132-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hui',
        },
        reserve_personnel: {
          id: '5edaa416-bfc1-11ed-afa1-0242ac120002',
          name: 'Jun Kai',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-20`,
        isExtra: false,
        personnel: {
          id: '78c9dc16-bfc1-11ed-afa1-0242ac120002',
          name: 'Wang Li',
        },
        reserve_personnel: {
          id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hao',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-21`,
        isExtra: false,
        personnel: {
          id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
          name: 'Zhi Hao',
        },
        reserve_personnel: {
          id: '9d658fae-c343-11ed-afa1-0242ac120002',
          name: 'Darryl Koh',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-22`,
        isExtra: false,
        personnel: {
          id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hao',
        },
        reserve_personnel: {
          id: '5edaa132-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hui',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-23`,
        isExtra: false,
        personnel: {
          id: '9d658fae-c343-11ed-afa1-0242ac120002',
          name: 'Darryl Koh',
        },
        reserve_personnel: {
          id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
          name: 'Zhi Hao',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-24`,
        isExtra: false,
        personnel: {
          id: '78c9dc16-bfc1-11ed-afa1-0242ac120002',
          name: 'Wang Li',
        },
        reserve_personnel: {
          id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
          name: 'demo',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-25`,
        isExtra: false,
        personnel: {
          id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hao',
        },
        reserve_personnel: {
          id: '9d658fae-c343-11ed-afa1-0242ac120002',
          name: 'Darryl Koh',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-26`,
        isExtra: false,
        personnel: {
          id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
          name: 'demo',
        },
        reserve_personnel: {
          id: '5edaa132-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hui',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-27`,
        isExtra: false,
        personnel: {
          id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hao',
        },
        reserve_personnel: {
          id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
          name: 'Zhi Hao',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-28`,
        isExtra: false,
        personnel: {
          id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
          name: 'demo',
        },
        reserve_personnel: {
          id: '78c9dc16-bfc1-11ed-afa1-0242ac120002',
          name: 'Wang Li',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-29`,
        isExtra: false,
        personnel: {
          id: '5edaa416-bfc1-11ed-afa1-0242ac120002',
          name: 'Jun Kai',
        },
        reserve_personnel: {
          id: 'a1196c88-c343-11ed-afa1-0242ac120002',
          name: 'Elliot Tan',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-30`,
        isExtra: false,
        personnel: {
          id: '5edaa132-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hui',
        },
        reserve_personnel: {
          id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002',
          name: 'Jia Hao',
        },
      },
      {
        date: `${currentYear}-${todayMonth}-31`,
        isExtra: false,
        personnel: {
          id: 'a1196c88-c343-11ed-afa1-0242ac120002',
          name: 'Elliot Tan',
        },
        reserve_personnel: {
          id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
          name: 'demo',
        },
      },
    ],
  },
];

// export const swapRecord_dates: SanitySwapRequest[] = [
//   {
//     _updatedAt: '${currentYear}-04-15',
//     reason: 'abcdefgwdawdawdawdawdad',
//     _type: 'swapRequest',
//     status: 'pending',
//     calendar: {
//       id: 'calendar-${currentYear}-03-01',
//       date: '${currentYear}-03-01',
//     },
//     receiver: {
//       id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
//       name: 'Zhi Hao',
//       avatar_url:
//         'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
//     },
//     receiverDate: `${currentYear}-${todayMonth}-27`,
//     _id: '9c23238b-0f67-43f2-a281-7e3167c92680',
//     requester: {
//       id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
//       name: 'demo',
//       avatar_url:
//         'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
//     },
//     _rev: 't2rWJTAb4uNhnFji5txjM4',
//     requesterDate: `${currentYear}-${todayMonth}-04`,
//     _createdAt: '${currentYear}-04-14',
//   },
//   {
//     receiver: {
//       id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
//       name: 'demo',
//       avatar_url:
//         'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
//     },
//     _rev: '1gKhFzwtTHqc5n8Z8BZVx6',
//     _createdAt: '${currentYear}-04-15',
//     _type: 'swapRequest',
//     calendar: {
//       id: 'calendar-${currentYear}-03-01',
//       date: '${currentYear}-03-01',
//     },
//     requester: {
//       id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
//       name: 'Zhi Hao',
//       avatar_url:
//         'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
//     },
//     reason: 'abcdefg',
//     requesterDate: `${currentYear}-${todayMonth}-27`,
//     _id: 'f7b62509-b55c-4d69-8fbb-7268fa792c30',
//     _updatedAt: '${currentYear}-04-15',
//     receiverDate: `${currentYear}-${todayMonth}-21`,
//     status: 'pending',
//   },
//   {
//     _type: 'swapRequest',
//     receiver: {
//       id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
//       name: 'demo',
//       avatar_url:
//         'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
//     },
//     receiverDate: `${currentYear}-${todayMonth}-10`,
//     _id: 'f86b497e-adea-458d-a028-807e0d9395a1',
//     calendar: {
//       id: 'calendar-${currentYear}-03-01',
//       date: '${currentYear}-03-01',
//     },
//     requester: {
//       id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
//       name: 'Zhi Hao',
//       avatar_url:
//         'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
//     },
//     reason: 'a',
//     requesterDate: `${currentYear}-${todayMonth}-20`,
//     status: 'pending',
//     _createdAt: '${currentYear}-04-15',
//     _rev: 'f5T2DmY3fkMt6I6qKjOpiP',
//     _updatedAt: '${currentYear}-04-15',
//   },
// ];
