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
  icons: { icon: '/icons/icon512_maskable.png', apple: '/apple-icon.png' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: site.name,
    startupImage: [
      {
        media:
          'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: 'splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_landscape.png',
      },
      {
        media:
          'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: 'splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png',
      },
      {
        media:
          'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: 'splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png',
      },
      {
        media:
          'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: 'splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png',
      },
      {
        media:
          'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: 'splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png',
      },
      {
        media:
          'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: 'splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png',
      },
      {
        media:
          'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: 'splash_screens/iPhone_11__iPhone_XR_landscape.png',
      },
      {
        media:
          'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: 'splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png',
      },
      {
        media:
          'screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: 'splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png',
      },
      {
        media:
          'screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: 'splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png',
      },
      {
        media:
          'screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: 'splash_screens/12.9__iPad_Pro_landscape.png',
      },
      {
        media:
          'screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: 'splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png',
      },
      {
        media:
          'screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: 'splash_screens/10.9__iPad_Air_landscape.png',
      },
      {
        media:
          'screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: 'splash_screens/10.5__iPad_Air_landscape.png',
      },
      {
        media:
          'screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: 'splash_screens/10.2__iPad_landscape.png',
      },
      {
        media:
          'screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: 'splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png',
      },
      {
        media:
          'screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        url: 'splash_screens/8.3__iPad_Mini_landscape.png',
      },
      {
        media:
          'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: 'splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png',
      },
      {
        media:
          'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: 'splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png',
      },
      {
        media:
          'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: 'splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png',
      },
      {
        media:
          'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: 'splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png',
      },
      {
        media:
          'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: 'splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png',
      },
      {
        media:
          'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: 'splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png',
      },
      {
        media:
          'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: 'splash_screens/iPhone_11__iPhone_XR_portrait.png',
      },
      {
        media:
          'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: 'splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png',
      },
      {
        media:
          'screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: 'splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png',
      },
      {
        media:
          'screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: 'splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png',
      },
      {
        media:
          'screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: 'splash_screens/12.9__iPad_Pro_portrait.png',
      },
      {
        media:
          'screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: 'splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png',
      },
      {
        media:
          'screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: 'splash_screens/10.9__iPad_Air_portrait.png',
      },
      {
        media:
          'screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: 'splash_screens/10.5__iPad_Air_portrait.png',
      },
      {
        media:
          'screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: 'splash_screens/10.2__iPad_portrait.png',
      },
      {
        media:
          'screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: 'splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png',
      },
      {
        media:
          'screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        url: 'splash_screens/8.3__iPad_Mini_portrait.png',
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
