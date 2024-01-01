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
    // no_of_extras: 0,
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
    // no_of_extras: 0,
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
    enlistment_date: '2023-05-11',
    ord_date: '2025-05-10',
    // totalDutyDone: 10,
    weekday_points: 1,
    weekend_points: 1,
    // no_of_extras: 2,
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
    ord_date: '2023-03-01',
    // totalDutyDone: 9,
    weekday_points: 1,
    weekend_points: 1,
    // no_of_extras: 0,
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
    // no_of_extras: 0,
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
    // no_of_extras: 0,
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
    // no_of_extras: 0,
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
    // no_of_extras: 0,
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
  `2023-${todayMonth}-03`,
  `2023-${todayMonth}-13`,
  `2023-${todayMonth}-26`,
  `2023-${todayMonth}-28`,
];

// export const calendar: Calendar[] = [
//   {
//     id: `calendar-2023-${todayMonth}-01`,
//     date: `2023-${todayMonth}-01`,
//     roster: [
//       {
//         date: `2023-${todayMonth}-01`,
// isno_of_Extras: false,
//         personnel: { id: '5edaa416-bfc1-11ed-afa1-0242ac120002', name: 'Jun Kai' },
//         standby: { id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05', name: 'demo' },
//       },
//       {
//         date: `2023-${todayMonth}-02`,
// isno_of_Extras: false,
//         personnel: { id: '5eda9fca-bfc1-11ed-afa1-0242ac120002', name: 'Zhi Hao' },
//         standby: { id: '9d658fae-c343-11ed-afa1-0242ac120002', name: 'Darryl Koh' },
//       },
//       {
//         date: `2023-${todayMonth}-03`,
// isno_of_Extras: false,
//         personnel: { id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05', name: 'demo' },
//         standby: { id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hao' },
//       },
//       {
//         date: `2023-${todayMonth}-04`,
// isno_of_Extras: false,
//         personnel: { id: 'a1196c88-c343-11ed-afa1-0242ac120002', name: 'Elliot Tan' },
//         standby: { id: '78c9dc16-bfc1-11ed-afa1-0242ac120002', name: 'Wang Li' },
//       },
//       {
//         date: `2023-${todayMonth}-05`,
// isno_of_Extras: false,
//         personnel: { id: '5edaa416-bfc1-11ed-afa1-0242ac120002', name: 'Jun Kai' },
//         standby: { id: '5edaa132-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hui' },
//       },
//       {
//         date: `2023-${todayMonth}-06`,
// isno_of_Extras: false,
//         personnel: { id: '9d658fae-c343-11ed-afa1-0242ac120002', name: 'Darryl Koh' },
//         standby: { id: '5eda9fca-bfc1-11ed-afa1-0242ac120002', name: 'Zhi Hao' },
//       },
//       {
//         date: `2023-${todayMonth}-07`,
// isno_of_Extras: false,
//         personnel: { id: '78c9dc16-bfc1-11ed-afa1-0242ac120002', name: 'Wang Li' },
//         standby: { id: '5edaa416-bfc1-11ed-afa1-0242ac120002', name: 'Jun Kai' },
//       },
//       {
//         date: `2023-${todayMonth}-08`,
// isno_of_Extras: false,
//         personnel: { id: '5edaa132-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hui' },
//         standby: { id: 'a1196c88-c343-11ed-afa1-0242ac120002', name: 'Elliot Tan' },
//       },
//       {
//         date: `2023-${todayMonth}-09`,
// isno_of_Extras: false,
//         personnel: { id: '5eda9fca-bfc1-11ed-afa1-0242ac120002', name: 'Zhi Hao' },
//         standby: { id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hao' },
//       },
//       {
//         date: `2023-${todayMonth}-10`,
// isno_of_Extras: false,
//         personnel: { id: 'a1196c88-c343-11ed-afa1-0242ac120002', name: 'Elliot Tan' },
//         standby: { id: '5edaa416-bfc1-11ed-afa1-0242ac120002', name: 'Jun Kai' },
//       },
//       {
//         date: `2023-${todayMonth}-11`,
// isno_of_Extras: false,
//         personnel: { id: '9d658fae-c343-11ed-afa1-0242ac120002', name: 'Darryl Koh' },
//         standby: { id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05', name: 'demo' },
//       },
//       {
//         date: `2023-${todayMonth}-12`,
// isno_of_Extras: false,
//         personnel: { id: '78c9dc16-bfc1-11ed-afa1-0242ac120002', name: 'Wang Li' },
//         standby: { id: '5eda9fca-bfc1-11ed-afa1-0242ac120002', name: 'Zhi Hao' },
//       },
//       {
//         date: `2023-${todayMonth}-13`,
// isno_of_Extras: false,
//         personnel: { id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05', name: 'demo' },
//         standby: { id: 'a1196c88-c343-11ed-afa1-0242ac120002', name: 'Elliot Tan' },
//       },
//       {
//         date: `2023-${todayMonth}-14`,
// isno_of_Extras: false,
//         personnel: { id: '5edaa416-bfc1-11ed-afa1-0242ac120002', name: 'Jun Kai' },
//         standby: { id: '78c9dc16-bfc1-11ed-afa1-0242ac120002', name: 'Wang Li' },
//       },
//       {
//         date: `2023-${todayMonth}-15`,
// isno_of_Extras: false,
//         personnel: { id: '9d658fae-c343-11ed-afa1-0242ac120002', name: 'Darryl Koh' },
//         standby: { id: '5edaa132-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hui' },
//       },
//       {
//         date: `2023-${todayMonth}-16`,
// isno_of_Extras: false,
//         personnel: { id: 'a1196c88-c343-11ed-afa1-0242ac120002', name: 'Elliot Tan' },
//         standby: { id: '78c9dc16-bfc1-11ed-afa1-0242ac120002', name: 'Wang Li' },
//       },
//       {
//         date: `2023-${todayMonth}-17`,
// isno_of_Extras: false,
//         personnel: { id: '5edaa132-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hui' },
//         standby: { id: '9d658fae-c343-11ed-afa1-0242ac120002', name: 'Darryl Koh' },
//       },
//       {
//         date: `2023-${todayMonth}-18`,
// isno_of_Extras: false,
//         personnel: { id: '5eda9fca-bfc1-11ed-afa1-0242ac120002', name: 'Zhi Hao' },
//         standby: { id: 'a1196c88-c343-11ed-afa1-0242ac120002', name: 'Elliot Tan' },
//       },
//       {
//         date: `2023-${todayMonth}-19`,
// isno_of_Extras: false,
//         personnel: { id: '5edaa132-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hui' },
//         standby: { id: '5edaa416-bfc1-11ed-afa1-0242ac120002', name: 'Jun Kai' },
//       },
//       {
//         date: `2023-${todayMonth}-20`,
// isno_of_Extras: false,
//         personnel: { id: '78c9dc16-bfc1-11ed-afa1-0242ac120002', name: 'Wang Li' },
//         standby: { id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hao' },
//       },
//       {
//         date: `2023-${todayMonth}-21`,
// isno_of_Extras: false,
//         personnel: { id: '5eda9fca-bfc1-11ed-afa1-0242ac120002', name: 'Zhi Hao' },
//         standby: { id: '9d658fae-c343-11ed-afa1-0242ac120002', name: 'Darryl Koh' },
//       },
//       {
//         date: `2023-${todayMonth}-22`,
// isno_of_Extras: false,
//         personnel: { id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hao' },
//         standby: { id: '5edaa132-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hui' },
//       },
//       {
//         date: `2023-${todayMonth}-23`,
// isno_of_Extras: false,
//         personnel: { id: '9d658fae-c343-11ed-afa1-0242ac120002', name: 'Darryl Koh' },
//         standby: { id: '5eda9fca-bfc1-11ed-afa1-0242ac120002', name: 'Zhi Hao' },
//       },
//       {
//         date: `2023-${todayMonth}-24`,
// isno_of_Extras: false,
//         personnel: { id: '78c9dc16-bfc1-11ed-afa1-0242ac120002', name: 'Wang Li' },
//         standby: { id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05', name: 'demo' },
//       },
//       {
//         date: `2023-${todayMonth}-25`,
// isno_of_Extras: false,
//         personnel: { id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hao' },
//         standby: { id: '9d658fae-c343-11ed-afa1-0242ac120002', name: 'Darryl Koh' },
//       },
//       {
//         date: `2023-${todayMonth}-26`,
// isno_of_Extras: false,
//         personnel: { id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05', name: 'demo' },
//         standby: { id: '5edaa132-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hui' },
//       },
//       {
//         date: `2023-${todayMonth}-27`,
// isno_of_Extras: false,
//         personnel: { id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hao' },
//         standby: { id: '5eda9fca-bfc1-11ed-afa1-0242ac120002', name: 'Zhi Hao' },
//       },
//       {
//         date: `2023-${todayMonth}-28`,
// isno_of_Extras: false,
//         personnel: { id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05', name: 'demo' },
//         standby: { id: '78c9dc16-bfc1-11ed-afa1-0242ac120002', name: 'Wang Li' },
//       },
//       {
//         date: `2023-${todayMonth}-29`,
// isno_of_Extras: false,
//         personnel: { id: '5edaa416-bfc1-11ed-afa1-0242ac120002', name: 'Jun Kai' },
//         standby: { id: 'a1196c88-c343-11ed-afa1-0242ac120002', name: 'Elliot Tan' },
//       },
//       {
//         date: `2023-${todayMonth}-30`,
// isno_of_Extras: false,
//         personnel: { id: '5edaa132-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hui' },
//         standby: { id: '5edaa2cc-bfc1-11ed-afa1-0242ac120002', name: 'Jia Hao' },
//       },
//       {
//         date: `2023-${todayMonth}-31`,
// isno_of_Extras: false,
//         personnel: { id: 'a1196c88-c343-11ed-afa1-0242ac120002', name: 'Elliot Tan' },
//         standby: { id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05', name: 'demo' },
//       },
//     ],
//   },
// ]

// export const swapRecord_dates: SanitySwapRequest[] = [
//   {
//     _updatedAt: '2023-04-15',
//     reason: 'abcdefgwdawdawdawdawdad',
//     _type: 'swapRequest',
//     status: 'pending',
//     calendar: {
//       id: 'calendar-2023-03-01',
//       date: '2023-03-01',
//     },
//     receiver: {
//       id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
//       name: 'Zhi Hao',
//       avatar_url:
//         'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
//     },
//     receiverDate: `2023-${todayMonth}-27`,
//     _id: '9c23238b-0f67-43f2-a281-7e3167c92680',
//     requester: {
//       id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
//       name: 'demo',
//       avatar_url:
//         'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
//     },
//     _rev: 't2rWJTAb4uNhnFji5txjM4',
//     requesterDate: `2023-${todayMonth}-04`,
//     _createdAt: '2023-04-14',
//   },
//   {
//     receiver: {
//       id: 'user.fdf11aae-d142-450b-87a4-559bc6e27f05',
//       name: 'demo',
//       avatar_url:
//         'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
//     },
//     _rev: '1gKhFzwtTHqc5n8Z8BZVx6',
//     _createdAt: '2023-04-15',
//     _type: 'swapRequest',
//     calendar: {
//       id: 'calendar-2023-03-01',
//       date: '2023-03-01',
//     },
//     requester: {
//       id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
//       name: 'Zhi Hao',
//       avatar_url:
//         'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
//     },
//     reason: 'abcdefg',
//     requesterDate: `2023-${todayMonth}-27`,
//     _id: 'f7b62509-b55c-4d69-8fbb-7268fa792c30',
//     _updatedAt: '2023-04-15',
//     receiverDate: `2023-${todayMonth}-21`,
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
//     receiverDate: `2023-${todayMonth}-10`,
//     _id: 'f86b497e-adea-458d-a028-807e0d9395a1',
//     calendar: {
//       id: 'calendar-2023-03-01',
//       date: '2023-03-01',
//     },
//     requester: {
//       id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
//       name: 'Zhi Hao',
//       avatar_url:
//         'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
//     },
//     reason: 'a',
//     requesterDate: `2023-${todayMonth}-20`,
//     status: 'pending',
//     _createdAt: '2023-04-15',
//     _rev: 'f5T2DmY3fkMt6I6qKjOpiP',
//     _updatedAt: '2023-04-15',
//   },
// ]
