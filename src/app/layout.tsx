import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JOK Cosmetics',
  description: 'Professionelle Kosmetikbehandlungen in Bad Liebenzell',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={`${inter.className} overflow-x-hidden`}>
        <Providers>
          <div className="w-screen overflow-x-hidden">
            <Navbar />
            {children}
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}
