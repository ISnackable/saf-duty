import NextAuth, { NextAuthOptions } from "next-auth";
import { SanityAdapter, SanityCredentials } from "next-auth-sanity";
import { client } from "@/lib/sanity.client";

export const authOptions: NextAuthOptions = {
  // @ts-ignore different api client type than next-auth-sanity
  providers: [SanityCredentials(client, "personnel")],
  session: {
    strategy: "jwt",
  },
  // @ts-ignore different api client type than next-auth-sanity
  adapter: SanityAdapter(client, {
    schemas: {
      verificationToken: "verification-request",
      account: "account",
      user: "personnel",
    },
  }),
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
