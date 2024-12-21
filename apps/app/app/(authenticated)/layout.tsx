import {
  SidebarInset,
  SidebarProvider,
} from '@repo/design-system/components/ui/sidebar';
import { env } from '@repo/env';
import { secure } from '@repo/security';
import type * as React from 'react';
import { BottomNav } from './components/bottom-nav';
import { Header } from './components/header';
import { AppSidebar } from './components/sidebar';

type AppLayoutProperties = {
  readonly children: React.ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  if (env.ARCJET_KEY) {
    await secure(['CATEGORY:PREVIEW']);
  }

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
};

export default AppLayout;
