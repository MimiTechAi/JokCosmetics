'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from './providers'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

function RootLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'j') {
        setShowAdmin(true)
        setTimeout(() => setShowAdmin(false), 2000) // Verstecke nach 2 Sekunden
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [])

  return (
    <div className="w-screen overflow-x-hidden">
      <Navbar />
      {children}
      <Toaster />
      {showAdmin && (
        <Link 
          href="/admin"
          className="fixed bottom-4 right-4 bg-transparent"
          onClick={(e) => {
            e.preventDefault()
            window.location.href = '/admin'
          }}
        >
          <button className="w-4 h-4" />
        </Link>
      )}
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
