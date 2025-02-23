import Link from 'next/link'
import Image from 'next/image'
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Kontakt */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Kontakt</h3>
            <ul className="space-y-2">
              <li>
                <a href="tel:+4915234720022" className="text-gray-600 hover:text-gray-900">
                  +49 152 34720022
                </a>
              </li>
              <li>
                <a href="mailto:thansuda22@googlemail.com" className="text-gray-600 hover:text-gray-900">
                  thansuda22@googlemail.com
                </a>
              </li>
              <li className="text-gray-600">
                Wilhelmstraße 17<br />
                75378 Bad Liebenzell
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" title="Dienstleistungen" className="text-gray-600 hover:text-gray-900">
                  Dienstleistungen
                </Link>
              </li>
              <li>
                <Link href="/book" title="Termin buchen" className="text-gray-600 hover:text-gray-900">
                  Termin buchen
                </Link>
              </li>
              <li>
                <Link href="/about" title="Über uns" className="text-gray-600 hover:text-gray-900">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" title="Datenschutz" className="text-gray-600 hover:text-gray-900">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" title="Allgemeine Geschäftsbedingungen" className="text-gray-600 hover:text-gray-900">
                  AGB
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Social Media</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/jok_cosmetics/"
                target="_blank"
                rel="noopener noreferrer"
                title="Visit our Instagram page"
                className="text-gray-600 hover:text-gray-900"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.facebook.com/jokcosmetics"
                target="_blank"
                rel="noopener noreferrer"
                title="Visit our Facebook page"
                className="text-gray-600 hover:text-gray-900"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href="https://wa.me/4915234720022"
                target="_blank"
                rel="noopener noreferrer"
                title="Contact us on WhatsApp"
                className="text-gray-600 hover:text-gray-900"
              >
                <FaWhatsapp className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-600 mb-8">
          <p>&copy; {new Date().getFullYear()} JOK Cosmetics. Alle Rechte vorbehalten.</p>
        </div>

        {/* Mimi Tech AI Branding Banner - Now smaller and at the bottom */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-emerald-600 opacity-90">
            <div className="absolute inset-0 bg-[url('/images/circuit-pattern.svg')] opacity-10"></div>
          </div>
          
          <div className="relative p-4 rounded-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full blur opacity-30"></div>
                  <Image
                    src="/images/mimi-tech-logo.svg"
                    alt="Mimi Tech AI"
                    width={160}
                    height={70}
                    className="h-14 w-auto relative"
                    priority
                  />
                </div>
                <div className="text-white">
                  <p className="text-sm text-cyan-100">Powered by</p>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    Mimi Tech AI
                  </h3>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <a
                  href="https://www.mimitechai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center px-4 py-2 text-sm bg-white text-cyan-600 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 w-0 bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300 ease-out group-hover:w-full"></div>
                  <span className="relative group-hover:text-white transition-colors duration-300">
                    Mehr erfahren
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
