import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Static export for Cloudflare Pages hosting
  output: "export",
};

export default nextConfig;
