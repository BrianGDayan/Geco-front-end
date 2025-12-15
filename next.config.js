/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Ignora errores de linting en el build para ahorrar memoria
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora errores de tipo en el build para ahorrar memoria
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;