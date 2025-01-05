import type { Metadata } from 'next';

import { Icons } from '@repo/design-system/components/icons';

export const metadata: Metadata = {
  title: 'Manage Invites',
  description: 'Admin page to manage organization invites.',
};

export default function AdminManageInvitesPage() {
  return (
    <div className="space-y-4 p-8 pt-4">
      <div className="flex w-full items-center space-y-2">
        <Icons.mailForward className="mr-3 inline-block h-8 w-8 items-center align-middle" />
        <h1 className="grow scroll-m-20 border-b pb-2 font-extrabold text-2xl tracking-tight sm:text-4xl lg:text-5xl">
          Manage Invites
        </h1>
      </div>
      <p className="text-sm leading-7 sm:text-base [&:not(:first-child)]:mt-6">
        View the overview of the invites, you can resend the invite or revoke
        the invite.
      </p>
    </div>
  );
}
