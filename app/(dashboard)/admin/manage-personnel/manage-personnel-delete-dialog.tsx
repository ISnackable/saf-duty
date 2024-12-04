'use client';

import { TrashIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import * as React from 'react';
import { toast } from 'sonner';

import { Icons } from '@/components/icons';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/fetcher';
import type { Profiles } from '@/lib/supabase/queries';

interface DeleteProfileDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  profile: Row<Profiles>['original'][];
  onSuccess?: () => void;
  showTrigger?: boolean;
}

export function DeleteProfileDialog({
  profile,
  onSuccess,
  showTrigger = true,
  ...props
}: DeleteProfileDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  function onDelete() {
    startDeleteTransition(async () => {
      if (!profile.length) return;
      else if (profile.length > 3) {
        toast.error('You can only delete up to 3 users at a time');
        props.onOpenChange?.(false);
        onSuccess?.();
        return;
      }

      const resPromises = profile.map((p) =>
        fetcher(`/api/profiles/${p.id}`, { method: 'DELETE' })
      );

      const toastId = toast.loading('Loading...');
      const resPromise = await Promise.allSettled(resPromises);
      toast.dismiss(toastId);

      resPromise.forEach((result) => {
        if (result.status === 'fulfilled') {
          toast.success('User deleted successfully');
        } else {
          toast.error(result.reason?.message || 'Failed to delete user');
        }
      });

      props.onOpenChange?.(false);
      onSuccess?.();
    });
  }

  return (
    <AlertDialog {...props}>
      {showTrigger ? (
        <AlertDialogTrigger asChild>
          <Button variant='outline'>
            <TrashIcon className='mr-2 size-4' aria-hidden='true' />
            Delete ({profile.length})
          </Button>
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{' '}
            <span className='font-medium'>{profile.length}</span>
            {profile.length === 1 ? ' user' : ' users'} from the servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='gap-2 sm:space-x-0'>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            aria-label='Delete selected rows'
            variant='destructive'
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Icons.spinner
                className='mr-2 size-4 animate-spin'
                aria-hidden='true'
              />
            )}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
