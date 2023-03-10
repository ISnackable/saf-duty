import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

import config from "../../site.config";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head>
          <meta name="application-name" content={config?.title || "PWA App"} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta
            name="apple-mobile-web-app-title"
            content={config?.title || "PWA App"}
          />
          <meta
            name="description"
            content={config?.description || "Best PWA App in the world"}
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />

          <meta
            name="theme-color"
            media="(prefers-color-scheme: light)"
            content="#f8f9fa"
          />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: dark)"
            content="#1a1b1e"
          />

          <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
