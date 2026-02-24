import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  cacheComponents: true,
};

export default nextConfig;
