'use client';

import useSWR from 'swr';

import type { Rosters } from '@/lib/types';
import { useSession } from '@repo/auth/client';

export function useUpcomingDuties() {
  const { data: session } = useSession();
  const activeOrganizationId = session?.session.activeOrganizationId;

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
