'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from './providers'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

function RootLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    let pressedKeys: string[] = []
    
    const handleKeyDown = (e: KeyboardEvent) => {
      pressedKeys.push(e.key.toLowerCase())
      
      // Prüfe auf die Tastenkombination "jok"
      if (pressedKeys.join('').includes('jok')) {
        router.push('/admin')
        pressedKeys = []
      }
      
      // Setze die Liste zurück, wenn sie zu lang wird
      if (pressedKeys.length > 10) {
        pressedKeys = []
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return (
    <div className="w-screen overflow-x-hidden">
      <Navbar />
      {children}
      <Toaster />
    </div>
  )
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
          <RootLayoutContent>{children}</RootLayoutContent>
        </Providers>
      </body>
    </html>
  )
}
