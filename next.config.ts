import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ["192.168.100.151"],
  },
};

export default nextConfig;
