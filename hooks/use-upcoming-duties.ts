'use client';

import useSWR from 'swr';

import { useUser } from '@/components/session-provider';
import type { RosterPatch } from '@/lib/supabase/queries';

export function useUpcomingDuties() {
  const user = useUser();

  const { data, error, isLoading, mutate } = useSWR<RosterPatch[]>(
    user ? `/api/profiles/${user.id}/upcoming-duties` : null
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
