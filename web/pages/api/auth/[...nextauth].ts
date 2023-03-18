import NextAuth, { NextAuthOptions } from 'next-auth'
import { SanityAdapter, SanityCredentials } from 'next-auth-sanity'
import { clientWithToken } from '@/lib/sanity.client'

export const authOptions: NextAuthOptions = {
  providers: [SanityCredentials(clientWithToken)],
  session: {
    strategy: 'jwt',
  },
  adapter: SanityAdapter(clientWithToken),
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      /* Step 1: update the token based on the user object */
      if (user) {
        token.role = user.role
        token.id = user.id.replace('drafts.', '')
      }
      return token
    },
    session({ session, token }) {
      /* Step 2: update the session.user based on the token object */
      if (token && session.user) {
        session.user.role = token.role
        session.user.id = token.id?.replace('drafts.', '')
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
