'use client';

import useSWR from 'swr';

import type { Notifications } from '@/lib/types';
import { client, useSession } from '@repo/auth/client';

export function useNotifications() {
  const { data: session } = useSession();
  const { data: activeOrganization } = client.useActiveOrganization();
  const activeOrganizationId = activeOrganization?.id;

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
