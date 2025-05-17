import { AnalyticsProvider } from '@repo/analytics';
import { AuthProvider } from '@repo/auth/provider';
import { VercelToolbar } from '@vercel/toolbar/next';
import type { ThemeProviderProps } from 'next-themes';
import { Icons } from './components/icons';
import { ProgressBar } from './components/progress-bar';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from './providers/theme';

type DesignSystemProviderProperties = ThemeProviderProps;

export const DesignSystemProvider = ({
  children,
  ...properties
}: DesignSystemProviderProperties) => (
  <ThemeProvider {...properties}>
    <AuthProvider>
      <AnalyticsProvider>
        <ProgressBar className="fixed top-0 z-[100] h-1 bg-primary">
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster
            closeButton
            icons={{
              success: (
                <Icons.circleDashedCheck className="size-5 text-[#089445] dark:text-[#32d46c]" />
              ),
              info: <Icons.infoCircle className="size-5 text-[#3498d9]" />,
              warning: (
                <Icons.alertTriangle className="size-5 text-[#f0c100]" />
              ),
              error: (
                <Icons.exclamationCircle className="size-5 text-[#da1415]" />
              ),
            }}
          />
          <VercelToolbar />
        </ProgressBar>
      </AnalyticsProvider>
    </AuthProvider>
  </ThemeProvider>
);
