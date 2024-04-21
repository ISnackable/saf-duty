'use client';

import { DataTable, type DataTableProps } from '@/components/data-table';
import useAllProfiles from '@/hooks/use-all-profiles';
import type { Profiles } from '@/lib/supabase/queries';

export function DutyPersonnelsTable({
  columns,
}: DataTableProps<Profiles, 'string'>) {
  const { data: allProfiles } = useAllProfiles();

  return <DataTable columns={columns} data={allProfiles} />;
}
