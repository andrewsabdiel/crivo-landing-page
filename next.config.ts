import type { NextConfig } from "next";

const repoName = "crivo-landing-page";
const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";
const basePath = isGitHubPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  reactStrictMode: true,
  devIndicators: false,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
    qualities: [75, 76, 82],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
