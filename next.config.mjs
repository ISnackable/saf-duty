import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  cacheStartUrl: true,
  dynamicStartUrl: true,
  dynamicStartUrlRedirect: '/login',
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({});

export default nextConfig;
