/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The /api/seed route reads data/catalog/*.json from disk at runtime;
  // include those files in its serverless bundle.
  outputFileTracingIncludes: {
    "/api/seed": ["./data/catalog/**/*"],
  },
};

module.exports = nextConfig;
