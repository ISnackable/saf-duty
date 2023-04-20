import { withAuth } from 'next-auth/middleware'

import siteConfig from '@/../site.config'

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname.startsWith('/admin')) {
        // Only allow admins to access the admin pages or demo user
        return token?.role === 'admin' || token?.id === siteConfig.demoUserId
      }
      return !!token
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})

export const config = {
  matcher: [
    '/',
    '/duty-personnels',
    '/duty-roster',
    '/manage-blockouts',
    '/profile',
    '/swap-duties',
    '/admin/:path*',
    '/collections/:path*',
  ],
}
