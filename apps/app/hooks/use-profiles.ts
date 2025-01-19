'use client';

import useSWR from 'swr';

import type { Profiles } from '@/lib/types';
import { client, useSession } from '@repo/auth/client';

export function useProfiles() {
  const { data: session } = useSession();
  const { data: activeOrganization } = client.useActiveOrganization();
  const activeOrganizationId = activeOrganization?.id;

  const { data, error, isLoading, mutate } = useSWR<Profiles>(
    session && activeOrganizationId
      ? `/api/organizations/${activeOrganizationId}/profiles/${session.user.id}`
      : null
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
