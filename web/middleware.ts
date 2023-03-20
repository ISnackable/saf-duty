import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname.startsWith('/admin')) {
        return token?.role === 'admin'
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
    '/manage-blockouts',
    '/profile',
    '/upcoming-duties',
    '/admin/:path*',
    '/collections/:path*',
  ],
}
