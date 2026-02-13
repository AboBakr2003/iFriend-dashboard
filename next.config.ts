import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  output: "standalone",
  reactStrictMode: true,

  images: {
    domains: ["i-friend.s3.eu-north-1.amazonaws.com"],
=======
  images: {
    // Allow S3-hosted images used in the app
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i-friend.s3.eu-north-1.amazonaws.com",
      },
    ],
>>>>>>> 1224055 (Enhance UI/UX)
  },
};

export default nextConfig;
