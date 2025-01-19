'use client';

import useSWR from 'swr';

import type { SwapRequests } from '@/lib/types';
import { client, useSession } from '@repo/auth/client';

export function useSwapRequests() {
  const { data: session } = useSession();
  const { data: activeOrganization } = client.useActiveOrganization();
  const activeOrganizationId = activeOrganization?.id;

  const { data, error, isLoading, mutate } = useSWR<SwapRequests[]>(
    session && activeOrganizationId
      ? `/api/organizations/${activeOrganizationId}/swap-requests/${session.user.id}`
      : null
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
