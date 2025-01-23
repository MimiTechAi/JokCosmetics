'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = document.getElementById('hero')?.offsetHeight || 0
      const scrollY = window.scrollY
      const progress = Math.min(scrollY / (heroHeight * 0.8), 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinks = [
    { href: '#', label: 'Start', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { href: '#services', label: 'Dienstleistungen', onClick: () => scrollToSection('services') },
    { href: '#gallery', label: 'Galerie', onClick: () => scrollToSection('gallery') },
    { href: '#about', label: 'Über', onClick: () => scrollToSection('about') },
    { href: '#contact', label: 'Kontakt', onClick: () => scrollToSection('contact') },
  ]

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      )}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 max-w-[2000px] mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center py-2">
            <div className={cn(
              "relative transition-all duration-300 w-[240px]",
              isScrolled ? "opacity-90" : "opacity-100"
            )}>
              <Image
                src="/images/logo/jok-text-logo.svg"
                alt="JOK Cosmetics Logo"
                width={240}
                height={60}
                className={cn(
                  "h-10 w-full transition-all duration-300",
                  isScrolled ? "filter brightness-0" : "filter brightness-100"
                )}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors font-medium",
                  isScrolled 
                    ? "text-black hover:text-gray-600" 
                    : "text-white hover:text-white/80"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/book">
              <Button 
                variant="default" 
                size="lg"
                className={cn(
                  "transition-all",
                  !isScrolled && "bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30"
                )}
              >
                Termin buchen
              </Button>
            </Link>
            <Link href="https://wa.me/4917353909280" target="_blank">
              <Button 
                variant="secondary" 
                size="lg" 
                className={cn(
                  "whatsapp-btn",
                  !isScrolled && "bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30"
                )}
              >
                <Image
                  src="/images/whatsapp.svg"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                WhatsApp
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
          >
            <div className={cn(
              "w-6 h-0.5 mb-1.5 transition-colors",
              isScrolled ? "bg-black" : "bg-white"
            )} />
            <div className={cn(
              "w-6 h-0.5 mb-1.5 transition-colors",
              isScrolled ? "bg-black" : "bg-white"
            )} />
            <div className={cn(
              "w-6 h-0.5 transition-colors",
              isScrolled ? "bg-black" : "bg-white"
            )} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="flex flex-col space-y-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-black hover:text-gray-600 px-4 py-2 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 space-y-2">
                <Link href="/book" className="block">
                  <Button variant="default" className="w-full">
                    Termin buchen
                  </Button>
                </Link>
                <Link href="https://wa.me/4917353909280" target="_blank" className="block">
                  <Button variant="secondary" className="w-full whatsapp-btn">
                    <Image
                      src="/images/whatsapp.svg"
                      alt="WhatsApp"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    WhatsApp
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
