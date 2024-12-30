import { env } from '@repo/env';
import { config, withAnalyzer, withSerwist } from '@repo/next-config';
import type { NextConfig } from 'next';

let nextConfig: NextConfig = {
  ...config,
  experimental: {
    ...config.experimental,
    optimizePackageImports: [
      'better-auth',
      'better-auth/plugins',
      'add-to-calendar-button-react',
    ],
  },
  // biome-ignore lint/suspicious/useAwait: headers is a Next.js API that must be async
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

if (env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig);
}

export default withSerwist(nextConfig) as NextConfig;
