/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimierung für Vercel-Deployment
  output: 'standalone',
  
  // Optimierung der Bildverarbeitung
  images: {
    domains: ['rttrdlnidqcstsdacmrw.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Internationalisierung
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
  },
  
  // Optimierung der Build-Zeit
  swcMinify: true,
  
  // Experimentelle Features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
}

module.exports = nextConfig
