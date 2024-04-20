'use client';

import useSWR from 'swr';

import { useUser } from '@/components/session-provider';
import type { Tables } from '@/types/supabase';

export interface Notifications {
  notifications: Omit<Tables<'notifications'>, 'user_id'>[];
  unreadCount: number;
}

export function useNotifications() {
  const user = useUser();

  const { data, error, isLoading, mutate } = useSWR<Notifications>(
    user ? `/api/profiles/${user?.id}/notifications` : null
  );

  return {
    data: data?.notifications,
    unreadCount: data?.unreadCount,
    isLoading,
    error,
    mutate,
  };
}
