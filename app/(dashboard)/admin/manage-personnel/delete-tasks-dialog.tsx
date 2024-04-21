'use client';

import { TrashIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import * as React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import type { Profiles } from '@/lib/supabase/queries';

// import { deleteTasks } from "../_lib/mutations"

interface DeleteTasksDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  tasks: Row<Profiles>[];
  onSuccess?: () => void;
  showTrigger?: boolean;
}

export function DeleteTasksDialog({
  tasks,
  onSuccess,
  showTrigger = true,
  ...props
}: DeleteTasksDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  return (
    <AlertDialog {...props}>
      {showTrigger ? (
        <AlertDialogTrigger asChild>
          <Button variant='outline'>
            <TrashIcon className='mr-2 size-4' aria-hidden='true' />
            Delete ({tasks.length})
          </Button>
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{' '}
            <span className='font-medium'>{tasks.length}</span>
            {tasks.length === 1 ? ' user' : ' users'} from the servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='gap-2 sm:space-x-0'>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            aria-label='Delete selected rows'
            onClick={() => {
              startDeleteTransition(() => {
                //   deleteTasks({
                //     rows: tasks,
                //     onSucess: onSuccess,
                //   })
                onSuccess?.();
              });
            }}
            disabled={isDeletePending}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
