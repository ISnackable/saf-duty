'use client';

import useSWR from 'swr';

import type { SwapRequests } from '@/lib/types';
import { useSession } from '@repo/auth/client';

export function useSwapRequests() {
  const { data: session } = useSession();
  const activeOrganizationId = session?.session.activeOrganizationId;

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
