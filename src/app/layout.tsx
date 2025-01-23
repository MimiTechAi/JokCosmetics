'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from './providers'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

function RootLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [secretCode, setSecretCode] = useState<string>('')
  const [shouldNavigate, setShouldNavigate] = useState(false)

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    setSecretCode(prev => {
      const newCode = prev + key
      console.log('Current code:', newCode)
      
      if (newCode.includes('jok')) {
        console.log('Admin-Code erkannt!')
        setShouldNavigate(true)
        return ''
      }
      
      return newCode.slice(-10)
    })
  }, [])

  useEffect(() => {
    if (shouldNavigate) {
      router.push('/admin')
      setShouldNavigate(false)
    }
  }, [shouldNavigate, router])

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [handleKeyPress])

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
