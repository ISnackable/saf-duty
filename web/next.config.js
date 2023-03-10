const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { hostname: "cdn.sanity.io" },
      { hostname: "source.unsplash.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "api.dicebear.com" },
    ],
  },
});

module.exports = nextConfig;
