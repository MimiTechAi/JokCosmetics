'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from './providers'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

function RootLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [secretCode, setSecretCode] = useState<string>('')

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      
      setSecretCode((prev) => {
        const newCode = prev + key
        console.log('Current code:', newCode) // Debug-Info
        
        // Prüfe, ob der Code "jok" enthält
        if (newCode.includes('jok')) {
          console.log('Admin-Code erkannt!') // Debug-Info
          router.push('/admin')
          return ''
        }
        
        // Behalte nur die letzten 10 Zeichen
        return newCode.slice(-10)
      })
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
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
