/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@wander/shared-types", "@wander/api-client", "@wander/ui-tokens"],
};

export default nextConfig;
