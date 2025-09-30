/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['puppeteer'],
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
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
