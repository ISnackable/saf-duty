import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import { SanityAdapter, SanityCredentials } from 'next-auth-sanity'
import { clientWithToken, getUserById } from '@/lib/sanity.client'

const createOptions = (req: NextApiRequest): NextAuthOptions => ({
  ...authOptions,
  callbacks: {
    async jwt({ token, user }) {
      /* Step 1: update the token based on the user object */
      if (user) {
        token.role = user.role
        token.id = user.id.replace('drafts.', '')
        token.ord = user.ord
        token.image = user.image
        token.enlistment = user.enlistment
      }

      // If the specified query param(s) exits(s), we know it's an update
      if (req.query?.update) {
        console.log("Updating user's token...")
        const updatedUser = await getUserById(token.id.replace('drafts.', ''))

        console.log("Updated user's token: ", updatedUser)
        token.name = updatedUser.name
        token.email = updatedUser.email
        token.role = updatedUser.role
        token.image = updatedUser.image
        token.enlistment = updatedUser.enlistment
        token.ord = updatedUser.ord
      }

      return token
    },
  },
})

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
        token.name = user.name
        token.email = user.email
        token.image = user.image
        token.role = user.role
        token.id = user.id.replace('drafts.', '')
        token.ord = user.ord
        token.enlistment = user.enlistment
      }
      return token
    },
    session({ session, token }) {
      /* Step 2: update the session.user based on the token object */
      if (token && session.user) {
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.image
        session.user.role = token.role
        session.user.id = token.id?.replace('drafts.', '')
        session.user.ord = token.ord
        session.user.enlistment = token.enlistment
      }
      return session
    },
  },
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, createOptions(req))
}

export default handler
