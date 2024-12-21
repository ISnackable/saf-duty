import { host } from '@repo/site-config';
import {
  adminClient,
  organizationClient,
  passkeyClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const client = createAuthClient({
  baseURL: host, // the base url of your auth server
  plugins: [adminClient(), organizationClient(), passkeyClient()],
});

export const {
  admin,
  signIn,
  signOut,
  signUp,
  useSession,
  organization,
  useListOrganizations,
  useActiveOrganization,
} = client;
