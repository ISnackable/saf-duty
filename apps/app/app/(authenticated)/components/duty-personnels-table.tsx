'use client';

import { useAllProfiles } from '@/hooks/use-all-profiles';
import type { Profiles } from '@/lib/types';

import { DataTable, type DataTableProps } from './data-table';

export function DutyPersonnelsTable(props: DataTableProps<Profiles, 'string'>) {
  const { data: allProfiles } = useAllProfiles();

  return <DataTable {...props} data={allProfiles} />;
}
