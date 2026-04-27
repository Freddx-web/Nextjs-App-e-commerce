import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure proper output directory for Vercel
  distDir: '.next',
  // Explicitly disable static export
  output: undefined,
  // Handle build cleanup
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
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
