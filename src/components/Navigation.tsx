'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface NavigationProps {
  locale: string;
}

export default function Navigation({ locale }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { href: `/${locale}`, label: 'Home' },
    { href: `/${locale}#services`, label: 'Services' },
    { href: `/${locale}#about`, label: 'About' },
    { href: `/${locale}#gallery`, label: 'Gallery' },
    { href: `/${locale}#contact`, label: 'Contact' },
    { href: `/booking`, label: 'Book Now' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-serif"
            >
              <span className={isScrolled ? 'text-primary' : 'text-white'}>
                Jok Cosmetics
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  isScrolled
                    ? 'text-gray-600 hover:text-primary'
                    : 'text-white hover:text-gray-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            <motion.div
              className={`w-6 h-6 flex flex-col justify-center items-center ${
                isScrolled ? 'text-primary' : 'text-white'
              }`}
            >
              <span
                className={`block w-6 h-0.5 transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-0.5' : ''
                } ${isScrolled ? 'bg-primary' : 'bg-white'}`}
              />
              <span
                className={`block w-6 h-0.5 mt-1.5 transition-all duration-300 ${
                  isOpen ? '-rotate-45 -translate-y-1' : ''
                } ${isScrolled ? 'bg-primary' : 'bg-white'}`}
              />
            </motion.div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              <div className="flex flex-col space-y-4 py-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`transition-colors ${
                      isScrolled
                        ? 'text-gray-600 hover:text-primary'
                        : 'text-white hover:text-gray-200'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
