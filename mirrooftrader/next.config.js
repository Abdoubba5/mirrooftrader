/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ لا توقف الـ Build بسبب أخطاء TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ لا توقف الـ Build بسبب أخطاء ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
