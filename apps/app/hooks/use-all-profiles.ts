import useSWR from 'swr';

import type { Profiles } from '@/lib/types';
import { client, useSession } from '@repo/auth/client';

export function useAllProfiles() {
  const { data: session } = useSession();
  const { data: activeOrganization } = client.useActiveOrganization();
  const activeOrganizationId = activeOrganization?.id;

  const { data, error, isLoading, mutate } = useSWR<Profiles[]>(
    session && activeOrganizationId
      ? `/api/organizations/${activeOrganizationId}/profiles`
      : null
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
