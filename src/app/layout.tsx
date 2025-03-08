import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from './providers'
import { cn } from '@/lib/utils'
import { Metadata } from 'next'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true
})

const localInter = localFont({
  src: [
    {
      path: './../../public/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './../../public/fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './../../public/fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'JOK Cosmetics',
  description: 'Professionelles Permanent Make-up und Wimpernverlängerung in Bad Liebenzell',
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon',
      url: '/favicon/apple-touch-icon.png',
    },
  },
  manifest: '/manifest.json',
}

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={cn(localInter.variable, 'min-h-screen')}>
        <Providers>
          <div className="w-screen overflow-x-hidden">
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
