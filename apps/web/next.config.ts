import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@wander/shared-types", "@wander/api-client", "@wander/ui-tokens"],
};

export default nextConfig;
