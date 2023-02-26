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
  callbacks: {
    async jwt({ token, user }) {
      /* Step 1: update the token based on the user object */
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      /* Step 2: update the session.user based on the token object */
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
