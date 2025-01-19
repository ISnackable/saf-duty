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

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteProfileDialog
          profile={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
    </div>
  );
}
