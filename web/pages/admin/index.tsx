import type { GetServerSidePropsContext } from 'next'
import type { User } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'

AdminPage.title = 'Admin'

export default function AdminPage({ user }: { user: User }) {
  return JSON.stringify(user)
}

// Export the `session` prop to use sessions with Server Side Rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const { user } = session

  if (user?.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { user },
  }
}
