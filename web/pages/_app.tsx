import { useState } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'

import Layout from '@/components/Layout'
import RouterTransition from '@/components/RouterTransition'
import config from '../../site.config'

import '@/styles/globals.css'

export type NextPageWithTitle<P = object, IP = P> = NextPage<P, IP> & {
  title?: string
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithTitle
}

const pagesWithoutLayout = ['/login', '/404', '/500', '/privacy', '/terms']

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark')
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark')
    setColorScheme(nextColorScheme)
  }

  const router = useRouter()

  return (
    <>
      <Head>
        {Component?.title && typeof Component?.title === 'string' && (
          <title>{`${Component.title} - ${config.title || 'Duty Roster'}`}</title>
        )}

        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <SessionProvider session={session}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme }}>
            <DatesProvider settings={{ firstDayOfWeek: 0 }}>
              <ModalsProvider>
                <RouterTransition />
                <Notifications />

                {pagesWithoutLayout.includes(router.pathname) ? (
                  <Component {...pageProps} key={router.asPath} />
                ) : (
                  <Layout>
                    <Component {...pageProps} key={router.asPath} />
                  </Layout>
                )}
              </ModalsProvider>
            </DatesProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionProvider>
    </>
  )
}
