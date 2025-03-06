import type { client } from './client';
// import type { auth } from './server';

export type Session = typeof client.$Infer.Session;
export type User = Session['user'];
export type Organization = typeof client.$Infer.Organization;
export type ActiveOrganization = typeof client.$Infer.ActiveOrganization;
export type Invitation = typeof client.$Infer.Invitation;
export type Member = typeof client.$Infer.Member;
export type Roles = 'owner' | 'admin' | 'member';
export type ActiveMember = {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null | undefined;
  };
  id: string;
  createdAt: Date;
  userId: string;
  organizationId: string;
  role: string;
  teamId?: string | undefined;
};
