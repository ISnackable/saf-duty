'use client';

import useSWR from 'swr';

import type { Rosters } from '@/lib/types';
import { useSession } from '@repo/auth/client';

export function useRosters({ month, year }: { month?: string; year?: string }) {
  const { data: session } = useSession();
  const activeOrganizationId = session?.session.activeOrganizationId;

  // Create a stable key for SWR
  const usp = new URLSearchParams(month && year ? { month, year } : undefined);
  usp.sort();
  const qs = usp.toString();

  const { data, error, isLoading, mutate } = useSWR<Record<string, Rosters>>(
    session && activeOrganizationId && month && year
      ? `/api/organizations/${activeOrganizationId}/rosters?${qs}`
      : null
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
