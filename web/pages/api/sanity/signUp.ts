import { signUpHandler } from "next-auth-sanity";
import { client } from "@/lib/sanity.client";

// TODO: Add a function to check whether the password is secure enough
// @ts-ignore different api client type than next-auth-sanity
export default signUpHandler(client, "personnel");
