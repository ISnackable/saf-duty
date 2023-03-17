/* eslint-disable @typescript-eslint/no-empty-interface */
// nextauth.d.ts
import { DefaultUser } from 'next-auth'
// Define a role enum
export enum Role {
  user = 'user',
  admin = 'admin',
}
// common interface for JWT and Session
interface IUser extends DefaultUser {
  role?: Role
  ord?: Date
  enlistment?: Date
  blockouts?: Date[]
  totalDutyDone?: number
  weekdayPoints?: number
  weekendPoints?: number
  extraPoints?: number
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
