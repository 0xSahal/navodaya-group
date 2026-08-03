import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Hero and project covers request 95; Next defaults only allow 75.
    qualities: [75, 95],
    remotePatterns: [
      // All CMS-managed imagery is served from Sanity's asset CDN.
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
      // Remaining Unsplash placeholders. Can go once every image is Navodaya's.
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/services/architecture',
        destination: '/services/interior-architecture-design',
        permanent: true,
      },
      {
        source: '/services/interior-design',
        destination: '/services/interior-architecture-design',
        permanent: true,
      },
      {
        source: '/vendors/register',
        destination: '/vendors-register',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
