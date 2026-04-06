import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  // Keep this file deployment-neutral; platform-specific settings live in edgeone.json.
};

export default nextConfig;
