'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza';
import { useOs } from '@repo/design-system/hooks/use-os';
import { site } from '@repo/site-config';
import {
  IconDotsVertical,
  IconShare2,
  IconSquarePlus,
} from '@tabler/icons-react';
import type * as React from 'react';

export function InstallPWA({
  children,
  open,
  onOpenChange: setOpen,
}: {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const os = useOs();

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      {children}

      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>
            <div className="flex w-full items-center justify-center gap-1 font-medium text-3xl">
              <Icons.logo className="h-12 w-12" />
              {site.name || 'DEFAULT TITLE'}
            </div>
          </CredenzaTitle>
          <CredenzaDescription>
            To enable notifications, you need to install the app and enable push
            notifications.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <h5 className="scroll-m-20 font-semibold text-md tracking-tight">
            Follow these steps to install the app:
          </h5>
          <ul className="mb-4 ml-6 list-decimal [&>li]:mt-2">
            <li>
              Tap on
              <Button
                variant="outline"
                size="icon"
                className="mx-2 h-8 w-8 bg-muted align-middle hover:bg-muted"
              >
                {os === 'ios' ? (
                  <IconShare2 className="h-6 w-6 text-blue-400" />
                ) : (
                  <IconDotsVertical size="1rem" />
                )}
              </Button>
              {os === 'ios' ? 'in Safari tab bar' : 'in Chrome nav bar'}
            </li>
            <li>
              Scroll and select{' '}
              <code className="relative rounded border border-input bg-muted px-[0.4rem] py-[0.3rem] font-bold text-sm">
                Add to Home Screen{' '}
                <IconSquarePlus className="inline h-4 w-4 align-middle" />
              </code>
            </li>
            <li>
              Look for the
              <Button
                variant="outline"
                size="icon"
                className="mx-2 h-8 w-8 bg-muted align-middle hover:bg-muted"
              >
                <Icons.logo className="h-12 w-12" />
              </Button>
              icon on your home screen
            </li>
          </ul>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline">Close</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
