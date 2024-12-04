'use client';

import { type Table } from '@tanstack/react-table';

import { type Profiles } from '@/lib/supabase/queries';

import { DeleteProfileDialog } from './manage-personnel-delete-dialog';

interface ManagePersonnelToolbarProps {
  table: Table<Profiles>;
}

// This component is not memoized because it is a toolbar and should always be re-rendered
export function ManagePersonnelToolbar({ table }: ManagePersonnelToolbarProps) {
  'use no memo';

  return (
    <div className='flex items-center gap-2'>
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
