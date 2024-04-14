'use client';

import useSWR from 'swr';

import { useUser } from '@/components/session-provider';
import { SwapRequests } from '@/lib/supabase/queries';

export function useSwapRequests() {
  const user = useUser();

  const { data, error, isLoading, mutate } = useSWR<SwapRequests[]>(
    user ? `/api/profiles/${user?.id}/swap-requests` : null
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
