import { host } from '@repo/site-config';
import {
  multiSessionClient,
  organizationClient,
  passkeyClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const client = createAuthClient({
  baseURL: host, // the base url of your auth server
  plugins: [organizationClient(), passkeyClient(), multiSessionClient()],
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  organization,
  useListOrganizations,
  useActiveOrganization,
} = client;
