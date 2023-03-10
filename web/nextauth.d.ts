// nextauth.d.ts
import {  DefaultUser } from "next-auth";
// Define a role enum
export enum Role {
  user = "user",
  admin = "admin",
}
// common interface for JWT and Session
interface IUser extends DefaultUser {
  role?: Role;
  blockouts?: Date[];
  weekdayPoints?: number;
  weekendPoints?: number;
  extraPoints?: number;
}
declare module "next-auth" {
  type User = IUser;
  interface Session {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  type JWT = IUser;
}
