import { groq } from "next-sanity";

export const getAllUsersQuery = groq`*[_type == "user"]{
    name,
    image,
    blockouts,
    weekdayPoints,
    weekendPoints,
    extraPoints
}`;
