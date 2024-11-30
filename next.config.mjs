import withBundleAnalyzer from '@next/bundle-analyzer';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  disable: process.env.NODE_ENV === 'development',
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
});

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = bundleAnalyzer(
  withSerwist({
    experimental: {
      reactCompiler: true,
      optimizePackageImports: ['add-to-calendar-button-react'],
      serverActions: {
        allowedOrigins: ['localhost:3000'],
      },
    },

    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-Robots-Tag',
              value: 'noindex, nofollow',
            },
          ],
        },
      ];
    },

    images: {
      remotePatterns: [
        {
          hostname: 'api.dicebear.com',
        },
        {
          hostname: '*.supabase.co',
          pathname: '/storage/**',
        },
      ],
    },
  })
);

export default nextConfig;
