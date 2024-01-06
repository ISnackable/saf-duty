import withPWAInit from '@ducanh2912/next-pwa';
import withBundleAnalyzer from '@next/bundle-analyzer';
import million from 'million/compiler';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const PWA = withPWAInit({
  dest: 'public',
  cacheStartUrl: true,
  dynamicStartUrl: true,
  dynamicStartUrlRedirect: '/login',
  workboxOptions: {
    disableDevLogs: true,
  },
});

const millionConfig = {
  auto: {
    rsc: true,
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = bundleAnalyzer(PWA({}));

export default million.next(nextConfig, millionConfig);
