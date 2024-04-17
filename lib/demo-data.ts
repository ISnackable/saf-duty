// All the demo data that used as fallbacks when there's nothing in the dataset yet
import { demo } from '@/lib/config';
import type { Profiles, SwapRequests } from '@/lib/supabase/queries';

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

export const demoUsers: Profiles[] = [
  {
    id: demo.id,
    name: 'demo',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
    avatar_url:
      'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    enlistment_date: '2022-01-02',
    ord_date: '2024-01-01',
    weekday_points: 0,
    weekend_points: 2,
    no_of_extras: 0,
    blockout_dates: blockouts,
    max_blockouts: 8,
    onboarded: false,
    role: 'user',
  },
  {
    id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
    name: 'Zhi Hao',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
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
    onboarded: false,
    role: 'user',
  },
  {
    id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
    name: 'Jia Hui',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
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
    onboarded: false,
    role: 'user',
  },
  {
    id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
    name: 'Jia Hao',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
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
    onboarded: false,
    role: 'user',
  },
  {
    id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
    name: 'Jun Kai',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
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
    onboarded: false,
    role: 'user',
  },
  {
    id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
    name: 'Wang Li',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
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
    onboarded: false,
    role: 'user',
  },
  {
    id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
    name: 'Darryl Koh',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
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
    onboarded: false,
    role: 'user',
  },
  {
    id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
    name: 'Elliot Tan',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
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
    onboarded: false,
    role: 'user',
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
    duty_date: `${currentYear}-${todayMonth}-01`,
    is_extra: false,
    duty_personnel: {
      id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
      name: 'Jun Kai',
    },
    reserve_duty_personnel: {
      id: demo.id,
      name: 'demo',
    },
  },
  {
    id: 2,
    duty_date: `${currentYear}-${todayMonth}-02`,
    is_extra: false,
    duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
    },
    reserve_duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
    },
  },
  {
    id: 3,
    duty_date: `${currentYear}-${todayMonth}-03`,
    is_extra: false,
    duty_personnel: {
      id: demo.id,
      name: 'demo',
    },
    reserve_duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
    },
  },
  {
    id: 4,
    duty_date: `${currentYear}-${todayMonth}-04`,
    is_extra: false,
    duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
    },
    reserve_duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
    },
  },
  {
    id: 5,
    duty_date: `${currentYear}-${todayMonth}-05`,
    is_extra: false,
    duty_personnel: {
      id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
      name: 'Jun Kai',
    },
    reserve_duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
    },
  },
  {
    id: 6,
    duty_date: `${currentYear}-${todayMonth}-06`,
    is_extra: false,
    duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
    },
    reserve_duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
    },
  },
  {
    id: 7,
    duty_date: `${currentYear}-${todayMonth}-07`,
    is_extra: false,
    duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
    },
    reserve_duty_personnel: {
      id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
      name: 'Jun Kai',
    },
  },
  {
    id: 8,
    duty_date: `${currentYear}-${todayMonth}-08`,
    is_extra: false,
    duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
    },
    reserve_duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
    },
  },
  {
    id: 9,
    duty_date: `${currentYear}-${todayMonth}-09`,
    is_extra: false,
    duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
    },
    reserve_duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
    },
  },
  {
    id: 10,
    duty_date: `${currentYear}-${todayMonth}-10`,
    is_extra: false,
    duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
    },
    reserve_duty_personnel: {
      id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
      name: 'Jun Kai',
    },
  },
  {
    id: 11,
    duty_date: `${currentYear}-${todayMonth}-11`,
    is_extra: false,
    duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
    },
    reserve_duty_personnel: {
      id: demo.id,
      name: 'demo',
    },
  },
  {
    id: 12,
    duty_date: `${currentYear}-${todayMonth}-12`,
    is_extra: false,
    duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
    },
    reserve_duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
    },
  },
  {
    id: 13,
    duty_date: `${currentYear}-${todayMonth}-13`,
    is_extra: false,
    duty_personnel: {
      id: demo.id,
      name: 'demo',
    },
    reserve_duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
    },
  },
  {
    id: 14,
    duty_date: `${currentYear}-${todayMonth}-14`,
    is_extra: false,
    duty_personnel: {
      id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
      name: 'Jun Kai',
    },
    reserve_duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
    },
  },
  {
    id: 15,
    duty_date: `${currentYear}-${todayMonth}-15`,
    is_extra: false,
    duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
    },
    reserve_duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
    },
  },
  {
    id: 16,
    duty_date: `${currentYear}-${todayMonth}-16`,
    is_extra: false,
    duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
    },
    reserve_duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
    },
  },
  {
    id: 17,
    duty_date: `${currentYear}-${todayMonth}-17`,
    is_extra: false,
    duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
    },
    reserve_duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
    },
  },
  {
    id: 18,
    duty_date: `${currentYear}-${todayMonth}-18`,
    is_extra: false,
    duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
    },
    reserve_duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
    },
  },
  {
    id: 19,
    duty_date: `${currentYear}-${todayMonth}-19`,
    is_extra: false,
    duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
    },
    reserve_duty_personnel: {
      id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
      name: 'Jun Kai',
    },
  },
  {
    id: 20,
    duty_date: `${currentYear}-${todayMonth}-20`,
    is_extra: false,
    duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
    },
    reserve_duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
    },
  },
  {
    id: 21,
    duty_date: `${currentYear}-${todayMonth}-21`,
    is_extra: false,
    duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
    },
    reserve_duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
    },
  },
  {
    id: 22,
    duty_date: `${currentYear}-${todayMonth}-22`,
    is_extra: false,
    duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
    },
    reserve_duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
    },
  },
  {
    id: 23,
    duty_date: `${currentYear}-${todayMonth}-23`,
    is_extra: false,
    duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
    },
    reserve_duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
    },
  },
  {
    id: 24,
    duty_date: `${currentYear}-${todayMonth}-24`,
    is_extra: false,
    duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
    },
    reserve_duty_personnel: {
      id: demo.id,
      name: 'demo',
    },
  },
  {
    id: 25,
    duty_date: `${currentYear}-${todayMonth}-25`,
    is_extra: false,
    duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
    },
    reserve_duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
    },
  },
  {
    id: 26,
    duty_date: `${currentYear}-${todayMonth}-26`,
    is_extra: false,
    duty_personnel: {
      id: demo.id,
      name: 'demo',
    },
    reserve_duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
    },
  },
  {
    id: 27,
    duty_date: `${currentYear}-${todayMonth}-27`,
    is_extra: false,
    duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
    },
    reserve_duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
    },
  },
  {
    id: 28,
    duty_date: `${currentYear}-${todayMonth}-28`,
    is_extra: false,
    duty_personnel: {
      id: demo.id,
      name: 'demo',
    },
    reserve_duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
    },
  },
  {
    id: 29,
    duty_date: `${currentYear}-${todayMonth}-29`,
    is_extra: false,
    duty_personnel: {
      id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
      name: 'Jun Kai',
    },
    reserve_duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
    },
  },
  {
    id: 30,
    duty_date: `${currentYear}-${todayMonth}-30`,
    is_extra: false,
    duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
    },
    reserve_duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
    },
  },
  {
    id: 31,
    duty_date: `${currentYear}-${todayMonth}-31`,
    is_extra: false,
    duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
    },
    reserve_duty_personnel: {
      id: demo.id,
      name: 'demo',
    },
  },
];

export const swapRequests: SwapRequests[] = [
  {
    id: 1,
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
    created_at: '${currentYear}-04-14',
    reason: 'I have a family event to attend to.',
    status: 'pending',
    receiver: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    receiver_roster: {
      id: 1,
      duty_date: `${currentYear}-${todayMonth}-27`,
      is_extra: false,
      duty_personnel: {
        id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
        name: 'Zhi Hao',
      },
      reserve_duty_personnel: {
        id: demo.id,
        name: 'demo',
      },
    },
    requester: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    requester_roster: {
      id: 1,
      duty_date: `${currentYear}-${todayMonth}-04`,
      is_extra: false,
      duty_personnel: {
        id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
        name: 'Zhi Hao',
      },
      reserve_duty_personnel: {
        id: demo.id,
        name: 'demo',
      },
    },
  },
  {
    id: 2,
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
    created_at: '${currentYear}-04-14',
    receiver: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    receiver_roster: {
      id: 1,
      duty_date: `${currentYear}-${todayMonth}-21`,
      is_extra: false,
      duty_personnel: {
        id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
        name: 'Zhi Hao',
      },
      reserve_duty_personnel: {
        id: demo.id,
        name: 'demo',
      },
    },
    status: 'pending',
    requester: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reason: 'I need to attend my family gathering',
    requester_roster: {
      id: 1,
      duty_date: `${currentYear}-${todayMonth}-27`,
      is_extra: false,
      duty_personnel: {
        id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
        name: 'Zhi Hao',
      },
      reserve_duty_personnel: {
        id: demo.id,
        name: 'demo',
      },
    },
  },
  {
    id: 3,
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
    created_at: '${currentYear}-04-14',
    receiver: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    receiver_roster: {
      id: 1,
      duty_date: `${currentYear}-${todayMonth}-10`,
      is_extra: false,
      duty_personnel: {
        id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
        name: 'Zhi Hao',
      },
      reserve_duty_personnel: {
        id: demo.id,
        name: 'demo',
      },
    },
    requester: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reason: 'I has a wedding to attend',
    requester_roster: {
      id: 1,
      duty_date: `${currentYear}-${todayMonth}-20`,
      is_extra: false,
      duty_personnel: {
        id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
        name: 'Zhi Hao',
      },
      reserve_duty_personnel: {
        id: demo.id,
        name: 'demo',
      },
    },
    status: 'pending',
  },
];
