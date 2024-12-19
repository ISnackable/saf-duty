import withBundleAnalyzer from '@next/bundle-analyzer';

// @ts-expect-error No declaration file
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';
import { env } from '@repo/env';
import withVercelToolbar from '@vercel/toolbar/plugins/next';
import type { NextConfig } from 'next';
import { createSecureHeaders } from 'next-secure-headers';

const otelRegex = /@opentelemetry\/instrumentation/;

const baseConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'img.clerk.com',
    //   },
    // ],
  },

  // biome-ignore lint/suspicious/useAwait: headers is async
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: createSecureHeaders({
          // HSTS Preload: https://hstspreload.org/
          forceHTTPSRedirect: [
            true,
            { maxAge: 63_072_000, includeSubDomains: true, preload: true },
          ],
        }),
      },
    ];
  },

  webpack(config, { isServer }) {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    config.ignoreWarnings = [{ module: otelRegex }];

    return config;
  },
};

export const config: NextConfig = env.FLAGS_SECRET
  ? withVercelToolbar()(baseConfig)
  : baseConfig;

export const withAnalyzer = (sourceConfig: NextConfig): NextConfig =>
  withBundleAnalyzer()(sourceConfig);
