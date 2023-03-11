// All the demo data that used as fallbacks when there's nothing in the dataset yet

import type { User } from "next-auth";

export const title = "Blog.";

export const description = "Example description.";

export const users: User[] = [
  {
    id: "5eda9aac-bfc1-11ed-afa1-0242ac120002",
    name: "Isaac Asimov",
    image:
      "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    ord: new Date(2024, 1, 1),
    totalDutyDone: 10,
  },
  {
    id: "5eda9fca-bfc1-11ed-afa1-0242ac120002",

    name: "Mary Shelley",
    image:
      "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    ord: new Date(2024, 2, 28),
    totalDutyDone: 12,
  },
  {
    id: "5edaa132-bfc1-11ed-afa1-0242ac120002",

    name: "Stanislaw Lem",
    image:
      "https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    ord: new Date(2025, 5, 10),
    totalDutyDone: 10,
  },
  {
    id: "5edaa2cc-bfc1-11ed-afa1-0242ac120002",

    name: "Frank Herbert",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",

    ord: new Date(2023, 3, 1),
    totalDutyDone: 9,
  },
  {
    id: "5edaa416-bfc1-11ed-afa1-0242ac120002",

    name: "Ursula K. Le Guin",
    image:
      "https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    ord: new Date(2024, 4, 1),
    totalDutyDone: 6,
  },
  {
    id: "78c9dc16-bfc1-11ed-afa1-0242ac120002",

    name: "Philip K Dick",
    image:
      "https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    ord: new Date(2024, 9, 29),
    totalDutyDone: 0,
  },
];
