/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { hostname: "cdn.sanity.io" },
      { hostname: "source.unsplash.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "api.dicebear.com" },
    ],
  },
};

module.exports = nextConfig;
