'use client';

import useSWR from 'swr';

import { useUser } from '@/components/session-provider';
import { Profiles } from '@/lib/supabase/queries';

export function useProfiles() {
  const user = useUser();

  const { data, error, isLoading, mutate } = useSWR<Profiles>(
    user ? `/api/profiles/${user?.id}` : null
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
