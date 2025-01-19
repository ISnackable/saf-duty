'use client';

import useSWR from 'swr';

import type { Rosters } from '@/lib/types';
import { client, useSession } from '@repo/auth/client';

export function useUpcomingDuties() {
  const { data: session } = useSession();
  const { data: activeOrganization } = client.useActiveOrganization();
  const activeOrganizationId = activeOrganization?.id;

  const { data, error, isLoading, mutate } = useSWR<Rosters[]>(
    session && activeOrganizationId
      ? `/api/organizations/${activeOrganizationId}/rosters/${session.user.id}`
      : null
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
