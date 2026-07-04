import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "192.168.1.9:3001",
    "192.168.1.9",
    "192.168.1.7",
    "192.168.1.7:3000",
    "localhost:3000",
    "localhost:3001"
  ],
  devIndicators: false,
};

export default nextConfig;
