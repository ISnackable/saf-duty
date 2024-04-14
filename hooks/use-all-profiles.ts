import useSWR from 'swr';

import type { Profiles } from '@/lib/supabase/queries';

export default function useAllProfiles() {
  const { data, error, isLoading, mutate } =
    useSWR<Profiles[]>('/api/profiles');

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
