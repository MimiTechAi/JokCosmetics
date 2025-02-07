'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PageContainer } from '@/components/PageContainer';

export default function ContactPage() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

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
                    <a href="tel:+4915234720022" className="text-gray-600 hover:text-pink-600 transition-colors">
                      +49 152 34720022
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

          {/* Google Maps Einbettung */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2632.8015937905747!2d8.731752776268386!3d48.76646667131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47971c3a8c4b3c4d%3A0x1c3b5c3b5c3b5c3b!2sWilhelmstra%C3%9Fe%2017%2C%2075378%20Bad%20Liebenzell!5e0!3m2!1sde!2sde!4v1620000000000!5m2!1sde!2sde"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
}
