'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profile?.role === 'admin');
      }
    };
    
    checkAdmin();
  }, []);

  const isHomePage = pathname === '/';

  const navLinks = [
    { href: '/', label: 'Start' },
    { href: '/services', label: 'Dienstleistungen' },
    { href: '/gallery', label: 'Galerie' },
    { href: '/about', label: 'Über' },
    { href: '/contact', label: 'Kontakt' },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
  ]

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-[#2D1B2D]/95 backdrop-blur-md shadow-lg' : 'bg-transparent',
      !isHomePage && 'bg-[#2D1B2D] shadow-lg'
    )}>
      <nav className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className={cn(
              "relative transition-all duration-300",
              isScrolled ? "w-[200px]" : "w-[240px]"
            )}>
              <Image
                src="/images/logo/jok-text-logo.svg"
                alt="JOK Cosmetics Logo"
                width={240}
                height={60}
                className={cn(
                  "h-10 w-auto transition-all duration-300",
                  isScrolled ? "opacity-90" : "opacity-100"
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
                  "transition-colors font-medium text-white/90 hover:text-white",
                  "relative py-2 after:absolute after:bottom-0 after:left-0 after:h-0.5",
                  "after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full",
                  pathname === link.href && "text-white after:w-full"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Link href="/book">
                Termin buchen
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
            title="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 overflow-hidden",
            isMobileMenuOpen ? "max-h-96" : "max-h-0"
          )}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition-colors",
                  pathname === link.href && "bg-white/10"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Termin buchen
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
