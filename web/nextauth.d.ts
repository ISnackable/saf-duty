/* eslint-disable @typescript-eslint/no-empty-interface */
// nextauth.d.ts
import { DefaultUser } from 'next-auth'
import { TDateISODate } from '@/lib/sanity.queries'
// Define a role enum
export enum Role {
  user = 'user',
  admin = 'admin',
}
// common interface for JWT and Session
interface IUser extends DefaultUser {
  role?: Role
  ord?: TDateISODate
  enlistment?: TDateISODate
  // blockouts?: TDateISODate[]
  // totalDutyDone?: number
  // weekdayPoints?: number
  // weekendPoints?: number
  // extra?: number
}
declare module 'next-auth' {
  interface User extends IUser {}
  interface Session {
    user?: User
  }
}
declare module 'next-auth/jwt' {
  interface JWT extends IUser {}
}
