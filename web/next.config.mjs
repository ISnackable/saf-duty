import WithPWA from "next-pwa";

const PWA = WithPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = PWA({
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

export default nextConfig;
