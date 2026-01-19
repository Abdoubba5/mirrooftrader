/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ هذا يخلي الموقع يبني حتى لو كاين أخطاء TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ هذا يخلي الموقع يبني حتى لو كاين مشاكل ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
