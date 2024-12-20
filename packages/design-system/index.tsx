import { AnalyticsProvider } from '@repo/analytics';
import { AuthProvider } from '@repo/auth/provider';
import { env } from '@repo/env';
import { VercelToolbar } from '@vercel/toolbar/next';
import type { ThemeProviderProps } from 'next-themes';
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
        <ProgressBar className="fixed top-0 h-1 bg-sky-500">
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
          {env.NODE_ENV === 'development' && env.FLAGS_SECRET && (
            <VercelToolbar />
          )}
        </ProgressBar>
      </AnalyticsProvider>
    </AuthProvider>
  </ThemeProvider>
);
