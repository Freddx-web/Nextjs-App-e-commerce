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
};

export default nextConfig;
