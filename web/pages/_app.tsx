import { useState } from "react";
import App from "next/app";
import type { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import type { Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { getCookie, setCookie } from "cookies-next";

import Layout from "@/components/Layout";
import RouterTransition from "@/components/RouterTransition";

import "@/styles/globals.css";

const pagesWithoutLayout = ["/login", "/404", "/500", "/privacy", "/terms"];

export default function MyApp(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const { session } = pageProps;

  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    // when color scheme is updated save it to cookie
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  const router = useRouter();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <SessionProvider session={session}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{ colorScheme }}
          >
            <DatesProvider settings={{ firstDayOfWeek: 0 }}>
              <ModalsProvider>
                <RouterTransition />
                <Notifications />

                {pagesWithoutLayout.includes(router.pathname) ? (
                  <Component {...pageProps} />
                ) : (
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                )}
              </ModalsProvider>
            </DatesProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionProvider>
    </>
  );
}

MyApp.getInitialProps = async (context: AppContext) => {
  let session: Session | null | undefined = undefined;
  // getSession works both server-side and client-side but we want to avoid any calls to /api/auth/session
  // on page load, so we only call it server-side.
  const appProps = await App.getInitialProps(context);
  if (typeof window === "undefined") session = await getSession(context.ctx);

  return {
    ...appProps,
    ...(session !== undefined ? { session } : {}),
    colorScheme: getCookie("mantine-color-scheme", context.ctx) || "dark",
  };
};
