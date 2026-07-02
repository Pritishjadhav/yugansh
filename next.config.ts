import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["192.168.1.7", "192.168.1.7:3000", "localhost:3000"],
  devIndicators: false,
};

export default nextConfig;
