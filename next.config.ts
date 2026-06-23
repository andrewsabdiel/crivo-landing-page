import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    qualities: [75, 76, 82],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
