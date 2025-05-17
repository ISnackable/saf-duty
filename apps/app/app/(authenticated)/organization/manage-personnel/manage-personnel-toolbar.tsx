'use client';

import type { Table } from '@tanstack/react-table';

import type { Profiles } from '@/lib/types';

import { cn } from '@repo/design-system/lib/utils';
import { DeleteProfileDialog } from './manage-personnel-delete-dialog';

interface ManagePersonnelToolbarProps {
  table: Table<Profiles>;
  className?: string;
}

// This component is not memoized because it is a toolbar and should always be re-rendered
export function ManagePersonnelToolbar({
  table,
  className,
}: ManagePersonnelToolbarProps) {
  'use no memo';

  if (table.getFilteredSelectedRowModel().rows.length <= 0) {
    return null;
  }

  return (
    <div className={cn('flex items-center', className)}>
      <DeleteProfileDialog
        profile={table
          .getFilteredSelectedRowModel()
          .rows.map((row) => row.original)}
        onSuccess={() => table.toggleAllRowsSelected(false)}
      />
    </div>
  );
}
