// All the demo data that used as fallbacks when there's nothing in the dataset yet

import type { User } from "next-auth";

export const title = "Blog.";

export const description = "Example description.";

export const users: User[] = [
  {
    id: "5eda9aac-bfc1-11ed-afa1-0242ac120002",
    name: "Jun Jie",
    image:
      "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    ord: new Date(2024, 1, 1),
    totalDutyDone: 10,
    weekdayPoints: 0,
    weekendPoints: 2,
    extra: 0,
    blockouts: [new Date(2024, 2, 4)],
  },
  {
    id: "5eda9fca-bfc1-11ed-afa1-0242ac120002",
    name: "Zhi Hao",
    image:
      "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    ord: new Date(2024, 2, 28),
    totalDutyDone: 12,
    weekdayPoints: 0,
    weekendPoints: 1,
    extra: 0,
    blockouts: [new Date(2024, 2, 13)],
  },
  {
    id: "5edaa132-bfc1-11ed-afa1-0242ac120002",
    name: "Jia Hui",
    image:
      "https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    ord: new Date(2025, 5, 10),
    totalDutyDone: 10,
    weekdayPoints: 1,
    weekendPoints: 1,
    extra: 2,
    blockouts: [],
  },
  {
    id: "5edaa2cc-bfc1-11ed-afa1-0242ac120002",
    name: "Jia Hao",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    ord: new Date(2023, 3, 1),
    totalDutyDone: 9,
    weekdayPoints: 1,
    weekendPoints: 1,
    extra: 0,
    blockouts: [],
  },
  {
    id: "5edaa416-bfc1-11ed-afa1-0242ac120002",
    name: "Jun Kai",
    image:
      "https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
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
    id: "78c9dc16-bfc1-11ed-afa1-0242ac120002",
    name: "Wang Li",
    image:
      "https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    ord: new Date(2024, 9, 29),
    totalDutyDone: 0,
    weekdayPoints: -1,
    weekendPoints: 2,
    extra: 0,
    blockouts: [new Date(2024, 2, 1), new Date(2024, 2, 27)],
  },
  {
    id: "9d658fae-c343-11ed-afa1-0242ac120002",
    name: "Darryl Koh",
    image:
      "https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
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
    id: "a1196c88-c343-11ed-afa1-0242ac120002",
    name: "Elliot Tan",
    image:
      "https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
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
];
