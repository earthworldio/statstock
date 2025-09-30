/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['puppeteer']
  },
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer');
    }
    return config;
  }
}

module.exports = nextConfig
