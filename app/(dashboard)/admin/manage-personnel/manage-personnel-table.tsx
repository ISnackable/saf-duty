'use client';

import { type Row } from '@tanstack/react-table';
import * as React from 'react';

import { DutyPersonnelsTable } from '@/components/duty-personnels-table';
import type { Profiles } from '@/lib/supabase/queries';

import { getColumns } from './columns';
import { DeleteProfileDialog } from './manage-personnel-delete-dialog';
import { EditProfileDialog } from './manage-personnel-edit-dialog';
import { ManagePersonnelToolbar } from './manage-personnel-toolbar';

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  type: 'edit' | 'delete';
}

export function ManagePersonnelTable() {
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Profiles> | null>(null);

  const columns = React.useMemo(
    () => getColumns({ setRowAction }),
    [setRowAction]
  );

  return (
    <>
      <DutyPersonnelsTable
        columns={columns}
        ToolbarBar={ManagePersonnelToolbar}
      />
      <EditProfileDialog
        open={rowAction?.type === 'edit'}
        onOpenChange={() => setRowAction(null)}
        profile={rowAction?.row.original ?? null}
        showTrigger={false}
      />
      <DeleteProfileDialog
        open={rowAction?.type === 'delete'}
        onOpenChange={() => setRowAction(null)}
        profile={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
}
