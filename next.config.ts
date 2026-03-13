import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/f_flow_builder',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
