import withBundleAnalyzer from '@next/bundle-analyzer';
import withSerwistInit from '@serwist/next';
import million from 'million/compiler';

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
});

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const millionConfig = {
  auto: {
    rsc: true,
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = bundleAnalyzer(
  withSerwist({
    logging: {
      fetches: {
        fullUrl: false,
      },
    },
  })
);

export default million.next(nextConfig, millionConfig);
