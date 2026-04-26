import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force static generation where possible
  experimental: {
    // Disable any experimental features that might cause export issues
  },
  // Ensure proper output directory
  distDir: '.next',
  // Handle build cleanup
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Disable static export to prevent export-detail.json issues
  output: undefined,
  // Disable tracing for Vercel deployment
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
