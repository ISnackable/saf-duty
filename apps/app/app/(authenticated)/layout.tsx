import { SidebarProvider } from '@repo/design-system/components/ui/sidebar';
import { env } from '@repo/env';
import { showBetaFeature } from '@repo/feature-flags';
import { secure } from '@repo/security';
import type { ReactNode } from 'react';
import { AppSidebar } from './components/sidebar';

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  if (env.ARCJET_KEY) {
    await secure(['CATEGORY:PREVIEW']);
  }

  // const session = await auth.api.getSession({
  //   headers: await headers(), // from next/headers
  // });

  // console.log(session);

  // if (!session?.user) {
  //   return redirect('/sign-in'); // from next/navigation
  // }

  const betaFeature = await showBetaFeature();

  return (
    <SidebarProvider>
      <AppSidebar>
        {betaFeature && (
          <div className="m-4 rounded-full bg-success p-1.5 text-center text-sm text-success-foreground">
            Beta feature now available
          </div>
        )}
        {children}
      </AppSidebar>
    </SidebarProvider>
  );
};

export default AppLayout;
