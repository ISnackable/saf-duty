// All the demo data that used as fallbacks when there's nothing in the dataset yet
import { addMonths, format } from 'date-fns';

import { demo, isDev } from '@/lib/config';
import type {
  Profiles,
  RosterPatch,
  SwapRequests,
} from '@/lib/supabase/queries';
import type { Tables } from '@/types/supabase';

const todayMonth = format(new Date(), 'MM') as `${number}${number}`;
const nextMonth = format(
  addMonths(new Date(), 1),
  'MM'
) as `${number}${number}`;
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
    created_at: '${currentYear}-01-01',
    id: demo.id,
    name: 'demo',
    email: 'demo@example.com',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
    avatar_url:
      'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    ord_date: '2024-01-01',
    total_duty_done: [{ count: 12 }],
    weekday_points: 0,
    weekend_points: 2,
    no_of_extras: 0,
    blockout_dates: blockouts,
    max_blockouts: 8,
    onboarded: isDev,
    role: 'user',
    user_settings: {
      notify_on_duty_reminder: false,
      notify_on_swap_requests: true,
      notify_on_rosters_published: true,
    },
  },
  {
    created_at: '${currentYear}-01-01',
    id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
    name: 'Zhi Hao',
    email: 'zhihao@example.com',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
    avatar_url:
      'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    ord_date: '2024-02-28',
    total_duty_done: [{ count: 12 }],
    weekday_points: 0,
    weekend_points: 1,
    no_of_extras: 0,
    blockout_dates: ['2024-02-13'],
    max_blockouts: 8,
    onboarded: false,
    role: 'user',
    user_settings: {
      notify_on_duty_reminder: false,
      notify_on_swap_requests: true,
      notify_on_rosters_published: true,
    },
  },
  {
    created_at: '${currentYear}-01-01',
    id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
    name: 'Jia Hui',
    email: 'jiahui@example.com',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
    avatar_url:
      'https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    ord_date: '2025-05-10',
    total_duty_done: [{ count: 10 }],
    weekday_points: 1,
    weekend_points: 1,
    no_of_extras: 2,
    blockout_dates: [],
    max_blockouts: 8,
    onboarded: false,
    role: 'user',
    user_settings: {
      notify_on_duty_reminder: false,
      notify_on_swap_requests: true,
      notify_on_rosters_published: true,
    },
  },
  {
    created_at: '${currentYear}-01-01',
    id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
    name: 'Jia Hao',
    email: 'jiahao@example.com',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
    avatar_url:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    ord_date: '${currentYear}-03-01',
    total_duty_done: [{ count: 9 }],
    weekday_points: 1,
    weekend_points: 1,
    no_of_extras: 0,
    blockout_dates: [],
    max_blockouts: 8,
    onboarded: false,
    role: 'user',
    user_settings: {
      notify_on_duty_reminder: false,
      notify_on_swap_requests: true,
      notify_on_rosters_published: true,
    },
  },
  {
    created_at: '${currentYear}-01-01',
    id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
    name: 'Jun Kai',
    email: 'junkai@example.com',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
    avatar_url:
      'https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    ord_date: '2024-04-01',
    total_duty_done: [{ count: 6 }],
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
    user_settings: {
      notify_on_duty_reminder: false,
      notify_on_swap_requests: true,
      notify_on_rosters_published: true,
    },
  },
  {
    created_at: '${currentYear}-01-01',
    id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
    name: 'Wang Li',
    email: 'wangli@example.com',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
    avatar_url:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    ord_date: '2024-09-29',
    total_duty_done: [{ count: 0 }],
    weekday_points: -1,
    weekend_points: 2,
    no_of_extras: 0,
    blockout_dates: ['2024-02-01', '2024-02-27'],
    max_blockouts: 8,
    onboarded: false,
    role: 'user',
    user_settings: {
      notify_on_duty_reminder: false,
      notify_on_swap_requests: true,
      notify_on_rosters_published: true,
    },
  },
  {
    created_at: '${currentYear}-01-01',
    id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
    name: 'Darryl Koh',
    email: 'darrylkoh@example.com',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
    avatar_url:
      'https://images.unsplash.com/photo-1531727991582-cfd25ce79613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    ord_date: '2024-02-13',
    total_duty_done: [{ count: 0 }],
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
    user_settings: {
      notify_on_duty_reminder: false,
      notify_on_swap_requests: true,
      notify_on_rosters_published: true,
    },
  },
  {
    created_at: '${currentYear}-01-01',
    id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
    name: 'Elliot Tan',
    email: 'elliottan@example.com',
    group_id: '59d5daa0-6620-4383-b3e3-358b76bf8ebd',
    avatar_url:
      'https://images.unsplash.com/photo-1614587185092-af24ed71c6e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    ord_date: '2024-06-23',
    total_duty_done: [{ count: 0 }],
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
    user_settings: {
      notify_on_duty_reminder: false,
      notify_on_swap_requests: true,
      notify_on_rosters_published: true,
    },
  },
];

export const upcomingDuties: RosterPatch[] = [
  {
    id: 1,
    duty_date: `${currentYear}-${todayMonth}-03`,
    is_extra: false,
    duty_personnel: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 2,
    duty_date: `${currentYear}-${todayMonth}-13`,
    is_extra: false,
    duty_personnel: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
      avatar_url:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 3,
    duty_date: `${currentYear}-${todayMonth}-26`,
    is_extra: false,
    duty_personnel: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
      avatar_url:
        'https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 4,
    duty_date: `${currentYear}-${todayMonth}-28`,
    is_extra: false,
    duty_personnel: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
];

export const dutyRoster: RosterPatch[] = [
  {
    id: 1,
    duty_date: `${currentYear}-${todayMonth}-01`,
    is_extra: false,
    duty_personnel: {
      id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
      name: 'Jun Kai',
      avatar_url:
        'https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 2,
    duty_date: `${currentYear}-${todayMonth}-02`,
    is_extra: false,
    duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
      avatar_url:
        'https://images.unsplash.com/photo-1531727991582-cfd25ce79613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
  },
  {
    id: 3,
    duty_date: `${currentYear}-${todayMonth}-03`,
    is_extra: false,
    duty_personnel: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 4,
    duty_date: `${currentYear}-${todayMonth}-04`,
    is_extra: false,
    duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
      avatar_url:
        'https://images.unsplash.com/photo-1614587185092-af24ed71c6e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    },
    reserve_duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
      avatar_url:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 5,
    duty_date: `${currentYear}-${todayMonth}-05`,
    is_extra: false,
    duty_personnel: {
      id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
      name: 'Jun Kai',
      avatar_url:
        'https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
      avatar_url:
        'https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 6,
    duty_date: `${currentYear}-${todayMonth}-06`,
    is_extra: false,
    duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
      avatar_url:
        'https://images.unsplash.com/photo-1531727991582-cfd25ce79613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    reserve_duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 7,
    duty_date: `${currentYear}-${todayMonth}-07`,
    is_extra: false,
    duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
      avatar_url:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
      name: 'Jun Kai',
      avatar_url:
        'https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 8,
    duty_date: `${currentYear}-${todayMonth}-08`,
    is_extra: false,
    duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
      avatar_url:
        'https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
      avatar_url:
        'https://images.unsplash.com/photo-1614587185092-af24ed71c6e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    },
  },
  {
    id: 9,
    duty_date: `${currentYear}-${todayMonth}-09`,
    is_extra: false,
    duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 10,
    duty_date: `${currentYear}-${todayMonth}-10`,
    is_extra: false,
    duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
      avatar_url:
        'https://images.unsplash.com/photo-1614587185092-af24ed71c6e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    },
    reserve_duty_personnel: {
      id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
      name: 'Jun Kai',
      avatar_url:
        'https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 11,
    duty_date: `${currentYear}-${todayMonth}-11`,
    is_extra: false,
    duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
      avatar_url:
        'https://images.unsplash.com/photo-1531727991582-cfd25ce79613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    reserve_duty_personnel: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 12,
    duty_date: `${currentYear}-${todayMonth}-12`,
    is_extra: false,
    duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
      avatar_url:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 13,
    duty_date: `${currentYear}-${todayMonth}-13`,
    is_extra: false,
    duty_personnel: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
      avatar_url:
        'https://images.unsplash.com/photo-1614587185092-af24ed71c6e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    },
  },
  {
    id: 14,
    duty_date: `${currentYear}-${todayMonth}-14`,
    is_extra: false,
    duty_personnel: {
      id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
      name: 'Jun Kai',
      avatar_url:
        'https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
      avatar_url:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 15,
    duty_date: `${currentYear}-${todayMonth}-15`,
    is_extra: false,
    duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
      avatar_url:
        'https://images.unsplash.com/photo-1531727991582-cfd25ce79613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    reserve_duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
      avatar_url:
        'https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 16,
    duty_date: `${currentYear}-${todayMonth}-16`,
    is_extra: false,
    duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
      avatar_url:
        'https://images.unsplash.com/photo-1614587185092-af24ed71c6e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    },
    reserve_duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
      avatar_url:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 17,
    duty_date: `${currentYear}-${todayMonth}-17`,
    is_extra: false,
    duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
      avatar_url:
        'https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
      avatar_url:
        'https://images.unsplash.com/photo-1531727991582-cfd25ce79613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
  },
  {
    id: 18,
    duty_date: `${currentYear}-${todayMonth}-18`,
    is_extra: false,
    duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
      avatar_url:
        'https://images.unsplash.com/photo-1614587185092-af24ed71c6e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    },
  },
  {
    id: 19,
    duty_date: `${currentYear}-${todayMonth}-19`,
    is_extra: false,
    duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
      avatar_url:
        'https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
      name: 'Jun Kai',
      avatar_url:
        'https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 20,
    duty_date: `${currentYear}-${todayMonth}-20`,
    is_extra: false,
    duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
      avatar_url:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 21,
    duty_date: `${currentYear}-${todayMonth}-21`,
    is_extra: false,
    duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
      avatar_url:
        'https://images.unsplash.com/photo-1531727991582-cfd25ce79613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
  },
  {
    id: 22,
    duty_date: `${currentYear}-${todayMonth}-22`,
    is_extra: false,
    duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
      avatar_url:
        'https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 23,
    duty_date: `${currentYear}-${todayMonth}-23`,
    is_extra: false,
    duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
      avatar_url:
        'https://images.unsplash.com/photo-1531727991582-cfd25ce79613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    reserve_duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 24,
    duty_date: `${currentYear}-${todayMonth}-24`,
    is_extra: false,
    duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
      avatar_url:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 25,
    duty_date: `${currentYear}-${todayMonth}-25`,
    is_extra: false,
    duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: 'cfb4aae7-1468-4ee9-97a1-88640ca888be',
      name: 'Darryl Koh',
      avatar_url:
        'https://images.unsplash.com/photo-1531727991582-cfd25ce79613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
  },
  {
    id: 26,
    duty_date: `${currentYear}-${todayMonth}-26`,
    is_extra: false,
    duty_personnel: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
      avatar_url:
        'https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 27,
    duty_date: `${currentYear}-${todayMonth}-27`,
    is_extra: false,
    duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 28,
    duty_date: `${currentYear}-${todayMonth}-28`,
    is_extra: false,
    duty_personnel: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: '3551e1e8-bfae-4f91-bd03-9deb17e982ef',
      name: 'Wang Li',
      avatar_url:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 29,
    duty_date: `${currentYear}-${todayMonth}-29`,
    is_extra: false,
    duty_personnel: {
      id: 'c293d2f5-8725-4b71-bfb8-a039b26eb565',
      name: 'Jun Kai',
      avatar_url:
        'https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
      avatar_url:
        'https://images.unsplash.com/photo-1614587185092-af24ed71c6e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    },
  },
  {
    id: 30,
    duty_date: `${currentYear}-${todayMonth}-30`,
    is_extra: false,
    duty_personnel: {
      id: '9f198785-bdf6-4e2d-b942-f5ee62c83402',
      name: 'Jia Hui',
      avatar_url:
        'https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reserve_duty_personnel: {
      id: 'b01dac97-6539-48ee-85f2-605b3bb43e03',
      name: 'Jia Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 31,
    duty_date: `${currentYear}-${todayMonth}-31`,
    is_extra: false,
    duty_personnel: {
      id: '0ef7a0ca-6334-4807-8fb0-dbe8c97a0bb6',
      name: 'Elliot Tan',
      avatar_url:
        'https://images.unsplash.com/photo-1614587185092-af24ed71c6e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    },
    reserve_duty_personnel: {
      id: demo.id,
      name: 'demo',
      avatar_url:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
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
        avatar_url:
          'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
      },
      reserve_duty_personnel: {
        id: demo.id,
        name: 'demo',
        avatar_url:
          'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
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
        avatar_url:
          'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
      },
      reserve_duty_personnel: {
        id: demo.id,
        name: 'demo',
        avatar_url:
          'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
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
        avatar_url:
          'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
      },
      reserve_duty_personnel: {
        id: demo.id,
        name: 'demo',
        avatar_url:
          'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
      },
    },
    status: 'pending',
    requester: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reason: 'I need to attend my family gathering.',
    requester_roster: {
      id: 1,
      duty_date: `${currentYear}-${todayMonth}-27`,
      is_extra: false,
      duty_personnel: {
        id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
        name: 'Zhi Hao',
        avatar_url:
          'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
      },
      reserve_duty_personnel: {
        id: demo.id,
        name: 'demo',
        avatar_url:
          'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
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
        avatar_url:
          'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
      },
      reserve_duty_personnel: {
        id: demo.id,
        name: 'demo',
        avatar_url:
          'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
      },
    },
    requester: {
      id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
      name: 'Zhi Hao',
      avatar_url:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
    reason: 'I have a wedding to attend.',
    requester_roster: {
      id: 1,
      duty_date: `${currentYear}-${todayMonth}-20`,
      is_extra: false,
      duty_personnel: {
        id: '5eda9fca-bfc1-11ed-afa1-0242ac120002',
        name: 'Zhi Hao',
        avatar_url:
          'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
      },
      reserve_duty_personnel: {
        id: demo.id,
        name: 'demo',
        avatar_url:
          'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
      },
    },
    status: 'pending',
  },
];

export const notifications: Omit<Tables<'notifications'>, 'user_id'>[] = [
  {
    id: 1,
    action: 'swap_requests',
    title: 'Swap Request',
    message: 'You have a new swap request from John Doe',
    created_at: '2024-04-06 13:54:14.056462+00',
    updated_at: '2024-04-06 13:54:14.056462+00',
    is_read: false,
  },
  {
    id: 2,
    action: null,
    title: 'Duty reminder!',
    message: 'You have a duty on Wednesday, 24 Apr 2024 at 8:00 AM.',
    created_at: '2024-04-06 14:08:28.22377+00',
    updated_at: '2024-04-06 14:08:28.22377+00',
    is_read: false,
  },
  {
    id: 3,
    action: null,
    title: 'Duty reminder!',
    message: 'You have a duty on Friday, 10 May 2024 at 8:00 AM.',
    created_at: '2024-04-11 10:04:01.70602+00',
    updated_at: '2024-04-11 10:04:01.70602+00',
    is_read: false,
  },
  {
    id: 4,
    action: null,
    title: 'Duty reminder!',
    message: 'You have a duty on Sunday, 12 May 2024 at 8:00 AM.',
    created_at: '2024-04-11 10:04:01.70602+00',
    updated_at: '2024-04-11 10:04:01.70602+00',
    is_read: false,
  },
];
