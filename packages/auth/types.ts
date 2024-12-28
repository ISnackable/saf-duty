import type { client } from './client';
import type { auth } from './server';

export type Session = typeof auth.$Infer.Session;
export type Organization = typeof client.$Infer.Organization;
export type ActiveOrganization = typeof client.$Infer.ActiveOrganization;
export type Invitation = typeof client.$Infer.Invitation;
export type Member = typeof client.$Infer.Member;
export type Roles = ['owner', 'admin', 'member'];
