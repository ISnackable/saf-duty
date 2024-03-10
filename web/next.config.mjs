import withBundleAnalyzer from '@next/bundle-analyzer';
import WithPWA from 'next-pwa';

const PWA = WithPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  dynamicStartUrlRedirect: '/login',
});
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = bundleAnalyzer(
  PWA({
    reactStrictMode: true,
    transpilePackages: ['geist'],
    images: {
      remotePatterns: [
        { hostname: 'cdn.sanity.io' },
        { hostname: 'source.unsplash.com' },
        { hostname: 'images.unsplash.com' },
        { hostname: 'api.dicebear.com' },
      ],
    },
  })
);

export default nextConfig;
