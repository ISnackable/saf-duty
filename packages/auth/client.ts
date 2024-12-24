import { host } from '@repo/site-config';
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const client = createAuthClient({
  baseURL: host, // the base url of your auth server
  plugins: [
    inferAdditionalFields({
      user: {
        initialOrganizationId: {
          type: 'string',
          required: true,
          input: true,
          returned: false,
        },
      },
    }),
    adminClient(),
    organizationClient(),
  ],
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
