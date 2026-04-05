import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // This tells Next.js not to try downloading the image on the server before serving it
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
    ],
  },
};

export default nextConfig;
