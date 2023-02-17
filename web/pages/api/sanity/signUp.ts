import { signUpHandler } from "next-auth-sanity";
import { client } from "@/lib/sanity.client";

// @ts-ignore different api client type than next-auth-sanity
export default signUpHandler(client, "personnel");
