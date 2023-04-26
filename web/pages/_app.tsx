import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { DatesProvider } from '@mantine/dates'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { SWRConfig } from 'swr'

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

const pagesWithoutLayout = ['/login', '/404', '/500', '/privacy', '/terms', '/faq']

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  })
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  const router = useRouter()

  return (
    <>
      <Head>
        {Component?.title && typeof Component?.title === 'string' && (
          <title>{`${Component.title} - ${config.title || 'Duty Roster'}`}</title>
        )}

        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </Head>

      <SessionProvider session={session}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <DatesProvider settings={{ firstDayOfWeek: 0 }}>
              <ModalsProvider>
                <RouterTransition />
                <Notifications />

                {pagesWithoutLayout.includes(router.pathname) ? (
                  <Component {...pageProps} key={router.asPath} />
                ) : (
                  <SWRConfig
                    value={{
                      fetcher: (resource, init) =>
                        fetch(resource, init)
                          .then((res) => res.json())
                          .then((data) => data.data),
                    }}
                  >
                    <Layout>
                      <Component {...pageProps} key={router.asPath} />
                    </Layout>
                  </SWRConfig>
                )}
              </ModalsProvider>
            </DatesProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionProvider>
    </>
  )
}
