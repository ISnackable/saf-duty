'use client';

import useSWRImmutable from 'swr/immutable';

import type { NagerDatePublicHoliday } from '@/types/nager.date';

export function usePublicHolidays(year: number = new Date().getFullYear()) {
  const { data, error, isLoading } = useSWRImmutable<NagerDatePublicHoliday[]>(
    `https://date.nager.at/api/v3/publicholidays/${year}/SG`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  return {
    data,
    isLoading,
    error,
  };
}
