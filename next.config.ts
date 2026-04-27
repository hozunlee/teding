import type { NextConfig } from 'next'
import withSerwistInit from '@serwist/next'

const isAppBuild = process.env.BUILD_ENV === 'app'

const ALLOWED_ORIGINS = [
  'https://eng.hololog.dev',
  'https://localhost',
  'capacitor://localhost',
  'http://localhost:3000',
  'http://localhost:4000',
]

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: isAppBuild ? 'export' : undefined,

  images: isAppBuild
    ? { unoptimized: true }
    : {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'img.youtube.com',
            pathname: '/vi/**',
          },
        ],
      },

  env: {
    NEXT_PUBLIC_API_URL:
      process.env.BUILD_ENV === 'app'
        ? 'https://eng.hololog.dev'
        : process.env.NEXT_PUBLIC_API_URL_LOCAL || '',
  },

  async headers() {
    if (isAppBuild) return []

    return [
      {
        source: '/api/:path*',
        has: [
          {
            type: 'header',
            key: 'origin',
            value: ALLOWED_ORIGINS.map((o) =>
              o.replace(/\./g, '\\.').replace(/\//g, '\\/')
            ).join('|'),
          },
        ],
        headers: [
          { key: 'Access-Control-Allow-Origin', value: ':origin' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ]
  },
}

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV !== 'production',
})

export default isAppBuild || process.env.NODE_ENV !== 'production'
  ? nextConfig
  : withSerwist(nextConfig)
