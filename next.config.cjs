/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimierung für Vercel-Deployment
  output: 'standalone',
  
  // Erweiterte Bildoptimierung
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rttrdlnidqcstsdacmrw.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'jok-cosmetics.de',
      }
    ],
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Erweiterte Internationalisierung
  i18n: {
    locales: ['de'],
    defaultLocale: 'de',
  },
  
  // Performance-Optimierungen
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Erweiterte Sicherheitsheader
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
