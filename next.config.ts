import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: undefined, // Ensure we're not forcing static export
  trailingSlash: false,
  images: {
    domains: ['i.ibb.co'], // Add image domains for external images
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
