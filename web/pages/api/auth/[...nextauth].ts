import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import type { CredentialsConfig } from 'next-auth/providers'
import Credentials from 'next-auth/providers/credentials'
import { SanityAdapter } from 'next-auth-sanity'
import argon2 from 'argon2'
import type { SanityClient } from '@sanity/client'

import { clientWithToken, getUserById } from '@/lib/sanity.client'
import { getUserByEmailQuery } from '@/lib/sanity.queries'

const SanityCredentials = (client: SanityClient, userSchema = 'user'): CredentialsConfig =>
  Credentials({
    name: 'Credentials',
    id: 'sanity-login',
    type: 'credentials',
    credentials: {
      email: {
        label: 'Email',
        type: 'text',
      },
      password: {
        label: 'Password',
        type: 'password',
      },
    },
    async authorize(credentials) {
      const { _id, ...user } = await client.fetch(getUserByEmailQuery, {
        userSchema,
        email: credentials?.email,
      })

      if (!user) throw new Error('Email does not exist')

      if (credentials?.password) {
        if (await argon2.verify(user.password, credentials.password)) {
          return {
            id: _id,
            ...user,
          }
        }
      }

      throw new Error('Password Invalid')
    },
  })

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
      // Only available on first time sign in
      if (user) {
        token.id = user.id.replace('drafts.', '')
        token.image = user.image
        token.role = user.role
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
