import withBundleAnalyzer from '@next/bundle-analyzer';

// @ts-expect-error No declaration file
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';
import { env } from '@repo/env';
import withSerwistInit from '@serwist/next';
import withVercelToolbar from '@vercel/toolbar/plugins/next';
import type { NextConfig } from 'next';

const otelRegex = /@opentelemetry\/instrumentation/;

const baseConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.dicebear.com',
      },
    ],
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

export const withSerwist = (sourceConfig: NextConfig): NextConfig =>
  withSerwistInit({
    disable: env.NODE_ENV === 'development',
    swSrc: 'app/sw.ts',
    swDest: 'public/sw.js',
  })(sourceConfig);
