import { auth } from '@repo/auth/server';
import {
  SidebarInset,
  SidebarProvider,
} from '@repo/design-system/components/ui/sidebar';
import { headers } from 'next/headers';
// import { env } from '@repo/env';
import type * as React from 'react';
import { BottomNav } from './components/bottom-nav';
import { Header } from './components/header';
import { AppSidebar } from './components/sidebar';

export const dynamic = 'force-dynamic';

type AppLayoutProperties = {
  readonly children: React.ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProperties) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log(session);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="max-w-full">
        <Header />

        <section className="mb-12 pb-8 md:container sm:mb-0 md:mx-auto">
          {children}
        </section>

        <footer>
          <BottomNav />
        </footer>
      </SidebarInset>

      {/* {data?.onboarded ? null : <DriverTour />} */}
    </SidebarProvider>
  );
}
