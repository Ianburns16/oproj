/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage
      {
        protocol: 'https',
        hostname: 'oxxiosnsgckwjhwrvvxa.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Pinterest
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      // Alamy
      {
        protocol: 'https',
        hostname: 'c8.alamy.com',
      },
      // ImageKit
      {
        protocol: 'https',
        hostname: 'media-hosting.imagekit.io',
      },
      // Add any other domains you use
    ],
    minimumCacheTTL: 60,
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
    optimizeCss: true,
    webpackBuildWorker: true,
  },
  transpilePackages: ['@supabase/supabase-js'],
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = nextConfig;