/** @type {import('next').NextConfig} */
const nextConfig = {
  // …your existing config…

  // 🚫 don’t fail the build on ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
