import withBundleAnalyzer from '@next/bundle-analyzer';

import withSerwistInit from '@serwist/next';
import type { NextConfig } from 'next';

const otelRegex = /@opentelemetry\/instrumentation/;

export const config: NextConfig = {
  experimental: {
    reactCompiler: true,
    optimizePackageImports: ['better-auth', 'better-auth/plugins'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },

  webpack(config, { isServer }) {
    if (isServer) {
      config.plugins = [...config.plugins];
    }

    config.ignoreWarnings = [{ module: otelRegex }];

    return config;
  },
};

export const withAnalyzer = (sourceConfig: NextConfig): NextConfig =>
  withBundleAnalyzer()(sourceConfig);

export const withSerwist = (sourceConfig: NextConfig): NextConfig =>
  withSerwistInit({
    disable: process.env.NODE_ENV !== 'production',
    swSrc: 'app/sw.ts',
    swDest: 'public/sw.js',
  })(sourceConfig);
