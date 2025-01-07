'use client';

import useSWR from 'swr';

import type { Notifications } from '@/lib/types';
import { useSession } from '@repo/auth/client';

export function useNotifications() {
  const { data: session } = useSession();
  const activeOrganizationId = session?.session.activeOrganizationId;

  const { data, error, isLoading, mutate } = useSWR<Notifications[]>(
    session && activeOrganizationId
      ? `/api/organizations/${activeOrganizationId}/notifications/${session.session.userId}`
      : null
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
