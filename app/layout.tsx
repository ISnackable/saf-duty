import './globals.css';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';

import { Icons } from '@/components/icons';
import { ProgressBar } from '@/components/progress-bar';
import { PushNotificationProvider } from '@/components/push-notification-provider';
import { SessionProvider } from '@/components/session-provider';
import { SWRProvider } from '@/components/swr-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { host, site } from '@/lib/config';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(host),
  applicationName: site.name,
  title: {
    default: site.name,
    template: `%s - ${site.name}`,
  },
  description: site.description,
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/manifest-icon-512.maskable.png',
    apple: '/icons/apple-icon-180.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: site.name,
    startupImage: [
      {
        media:
          'screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-2048-2732.jpg',
      },
      {
        media:
          'screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2732-2048.jpg',
      },
      {
        media:
          'screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1668-2388.jpg',
      },
      {
        media:
          'screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2388-1668.jpg',
      },
      {
        media:
          'screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1536-2048.jpg',
      },
      {
        media:
          'screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2048-1536.jpg',
      },
      {
        media:
          'screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1488-2266.jpg',
      },
      {
        media:
          'screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2266-1488.jpg',
      },
      {
        media:
          'screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1640-2360.jpg',
      },
      {
        media:
          'screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2360-1640.jpg',
      },
      {
        media:
          'screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1668-2224.jpg',
      },
      {
        media:
          'screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2224-1668.jpg',
      },
      {
        media:
          'screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1620-2160.jpg',
      },
      {
        media:
          'screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2160-1620.jpg',
      },
      {
        media:
          'screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1320-2868.jpg',
      },
      {
        media:
          'screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2868-1320.jpg',
      },
      {
        media:
          'screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1206-2622.jpg',
      },
      {
        media:
          'screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2622-1206.jpg',
      },
      {
        media:
          'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1290-2796.jpg',
      },
      {
        media:
          'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2796-1290.jpg',
      },
      {
        media:
          'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1179-2556.jpg',
      },
      {
        media:
          'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2556-1179.jpg',
      },
      {
        media:
          'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1284-2778.jpg',
      },
      {
        media:
          'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2778-1284.jpg',
      },
      {
        media:
          'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1170-2532.jpg',
      },
      {
        media:
          'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2532-1170.jpg',
      },
      {
        media:
          'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1125-2436.jpg',
      },
      {
        media:
          'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2436-1125.jpg',
      },
      {
        media:
          'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1242-2688.jpg',
      },
      {
        media:
          'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2688-1242.jpg',
      },
      {
        media:
          'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-828-1792.jpg',
      },
      {
        media:
          'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-1792-828.jpg',
      },
      {
        media:
          'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-1242-2208.jpg',
      },
      {
        media:
          'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-2208-1242.jpg',
      },
      {
        media:
          'screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-750-1334.jpg',
      },
      {
        media:
          'screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-1334-750.jpg',
      },
      {
        media:
          'screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: '/splash_screens/apple-splash-640-1136.jpg',
      },
      {
        media:
          'screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: '/splash_screens/apple-splash-1136-640.jpg',
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: {
      default: site.name,
      template: `%s - ${site.name}`,
    },
    description: site.description,
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn(GeistSans.variable, GeistMono.variable)}
    >
      <head>
        <meta
          name='theme-color'
          content='#101214'
          media='(prefers-color-scheme: dark)'
        />
        <meta
          name='theme-color'
          media='(prefers-color-scheme: light)'
          content='#ffffff'
        />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-touch-fullscreen' content='yes' />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'light' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className='bg-background text-foreground'>
        <main className='antialiased'>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem={true}
            disableTransitionOnChange
            themes={['light', 'dark', 'darkcord-dark']}
          >
            <PushNotificationProvider>
              <SessionProvider>
                <ProgressBar className='fixed top-0 z-[100] h-1 bg-primary'>
                  <SWRProvider>{children}</SWRProvider>
                </ProgressBar>
                <Toaster
                  closeButton
                  icons={{
                    success: (
                      <Icons.circleDashedCheck className='size-5 text-[#089445] dark:text-[#32d46c]' />
                    ),
                    info: (
                      <Icons.infoCircle className='size-5 text-[#3498d9]' />
                    ),
                    warning: (
                      <Icons.alertTriangle className='size-5 text-[#f0c100]' />
                    ),
                    error: (
                      <Icons.exclamationCircle className='size-5 text-[#da1415]' />
                    ),
                  }}
                />
              </SessionProvider>
            </PushNotificationProvider>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
