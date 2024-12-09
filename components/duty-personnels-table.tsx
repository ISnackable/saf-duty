'use client';

import { DataTable, type DataTableProps } from '@/components/data-table';
import { useAllProfiles } from '@/hooks/use-all-profiles';
import type { Profiles } from '@/lib/supabase/queries';

export function DutyPersonnelsTable(props: DataTableProps<Profiles, 'string'>) {
  const { data: allProfiles } = useAllProfiles();

  return <DataTable {...props} data={allProfiles} />;
}
