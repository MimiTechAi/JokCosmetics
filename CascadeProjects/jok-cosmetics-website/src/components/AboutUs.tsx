'use client';

import Image from 'next/image';

export default function AboutUs() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[600px] rounded-lg overflow-hidden">
            <Image
              src="/images/services/WhatsApp Image 2024-10-12 at 20.34.53.jpeg"
              alt="Jok Cosmetics Team"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="section-title">Über Jok Cosmetics</h2>
            <p className="text-lg text-gray-600">
              Willkommen in unserem exklusiven Beauty-Salon in Bad Liebenzell. Bei Jok Cosmetics verbinden 
              wir traditionelle Schönheitspflege mit modernsten Behandlungsmethoden, um Ihnen ein 
              einzigartiges Wellness-Erlebnis zu bieten.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-6 bg-pink-50 rounded-lg">
                <h3 className="text-2xl font-serif text-pink-600 mb-2">10+</h3>
                <p className="text-gray-600">Jahre Erfahrung</p>
              </div>
              <div className="text-center p-6 bg-pink-50 rounded-lg">
                <h3 className="text-2xl font-serif text-pink-600 mb-2">1000+</h3>
                <p className="text-gray-600">Zufriedene Kunden</p>
              </div>
            </div>
            <ul className="space-y-4 mt-8">
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Modernste Behandlungsmethoden</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Professionelles, zertifiziertes Team</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Hochwertige Pflegeprodukte</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
