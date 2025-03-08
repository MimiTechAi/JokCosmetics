'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PageContainer } from '@/components/PageContainer';
import { useEffect, useRef } from 'react';

export default function ContactPage() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && iframeRef.current) {
          iframeRef.current.src = iframeRef.current.dataset.src || '';
          observer.unobserve(iframeRef.current);
        }
      });
    }, { rootMargin: '200px' });

    if (iframeRef.current) {
      observer.observe(iframeRef.current);
    }

    return () => {
      if (iframeRef.current) {
        observer.unobserve(iframeRef.current);
      }
    };
  }, []);

  return (
    <PageContainer>
      <div ref={ref} className="max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-pink-400">
            Kontaktieren Sie uns
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Wir freuen uns darauf, von Ihnen zu hören. Kontaktieren Sie uns für Fragen oder 
            Terminvereinbarungen.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Kontaktinformationen */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-pink-600 mb-6">Kontaktdaten</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-gray-600">Wilhelmstraße 17, 75378 Bad Liebenzell</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-medium">Telefon</p>
                    <a href="tel:+491735390928" className="text-gray-600 hover:text-pink-600 transition-colors">
                      +49 173 5390928
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium">E-Mail</p>
                    <a href="mailto:thansuda22@googlemail.com" className="text-gray-600 hover:text-pink-600 transition-colors">
                      thansuda22@googlemail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-pink-600 mb-6">Öffnungszeiten</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Montag - Freitag</span>
                  <span className="font-medium">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Samstag</span>
                  <span className="font-medium">Nach Vereinbarung</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sonntag</span>
                  <span className="font-medium">Geschlossen</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Location Karte */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center"
          >
            <div className="w-full max-w-md mx-auto flex flex-col items-center">
              <div className="text-pink-500 mb-6">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Unsere Location</h3>
              
              <div className="text-gray-600 text-center mb-8">
                <p className="text-lg mb-2">Wilhelmstraße 17</p>
                <p className="text-lg">75378 Bad Liebenzell</p>
              </div>
              
              <a 
                href="https://www.google.com/maps/place/Wilhelmstra%C3%9Fe+17,+75378+Bad+Liebenzell/@48.7661497,8.7321891,17z/data=!3m1!4b1!4m6!3m5!1s0x47977af49e2af6ef:0x66d8fe28b0a0e7!8m2!3d48.7661497!4d8.7343778!16s%2Fg%2F11csn0l4lk?entry=ttu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-full transition-colors duration-200"
              >
                In Google Maps öffnen
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
}
