/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@readable/mermaid'],
  experimental: {
    esmExternals: true,
  },
}

module.exports = nextConfig
