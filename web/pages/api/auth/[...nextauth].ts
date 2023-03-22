import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import { SanityAdapter, SanityCredentials } from 'next-auth-sanity'
import { clientWithToken, getUserById } from '@/lib/sanity.client'

export const createOptions = (req: NextApiRequest): NextAuthOptions => ({
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
        token.id = user.id.replace('drafts.', '')
        token.image = user.image
        token.role = user.role
        // TODO: FIX ME, returns reference obj instead of value
        token.unit = user.unit
        token.ord = user.ord
        token.enlistment = user.enlistment
      }

      // If the specified query param(s) exits(s), we know it's an update
      if (req.query?.update) {
        console.log("Updating user's token...")
        const updatedUser = await getUserById(token.id.replace('drafts.', ''))

        console.log("Updated user's token: ", updatedUser)
        token.name = updatedUser.name
        token.email = updatedUser.email
        token.image = updatedUser.image
        token.role = updatedUser.role
        token.unit = updatedUser.unit
        token.ord = updatedUser.ord
        token.enlistment = updatedUser.enlistment
      }

      return token
    },
    session({ session, token }) {
      /* Step 2: update the session.user based on the token object */
      if (token && session.user) {
        session.user.id = token.id?.replace('drafts.', '')
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.image
        session.user.role = token.role
        session.user.unit = token.unit
        session.user.ord = token.ord
        session.user.enlistment = token.enlistment
      }
      return session
    },
  },
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, createOptions(req))
}

export default handler
