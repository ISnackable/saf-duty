import { env } from '@repo/env';
import { config, withAnalyzer, withSerwist } from '@repo/next-config';
import { host } from '@repo/site-config';
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
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: host },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
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

export default withSerwist(nextConfig);
