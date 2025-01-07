'use client';

import useSWR from 'swr';

import type { Profiles } from '@/lib/types';
import { useSession } from '@repo/auth/client';

export function useProfiles() {
  const { data: session } = useSession();
  const activeOrganizationId = session?.session.activeOrganizationId;

  const { data, error, isLoading, mutate } = useSWR<Profiles[]>(
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
