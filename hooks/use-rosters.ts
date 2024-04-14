'use client';

import useSWR from 'swr';

import { useUser } from '@/components/session-provider';
import type { DutyDate } from '@/lib/duty-roster';

export function useRosters({ month, year }: { month?: string; year?: string }) {
  const user = useUser();

  const usp = new URLSearchParams(month && year ? { month, year } : undefined);
  // Create a stable key for SWR
  usp.sort();
  const qs = usp.toString();

  const { data, error, isLoading, mutate } = useSWR<Record<string, DutyDate>>(
    user && month && year ? `/api/rosters?${qs}` : null
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
