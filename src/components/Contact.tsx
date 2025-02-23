'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function Contact() {
  return (
    <section className="py-20 bg-pink-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-pink-500"
          >
            Kontaktieren Sie uns
          </motion.h1>
          
          <p className="text-center text-gray-600 mb-12">
            Wir freuen uns darauf, von Ihnen zu hören. Kontaktieren Sie uns für Fragen oder{' '}
            <span className="text-pink-500">Terminvereinbarungen</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-pink-500 mb-6">Kontaktdaten</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-pink-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Adresse</h3>
                    <p className="text-gray-600">Wilhelmstraße 17, 75378 Bad Liebenzell</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-pink-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Telefon</h3>
                    <p className="text-gray-600">+49 152 34720022</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-pink-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">E-Mail</h3>
                    <p className="text-gray-600">thansuda22@googlemail.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-pink-500 mb-6">Öffnungszeiten</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montag - Freitag</span>
                    <span className="text-gray-900">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Samstag</span>
                    <span className="text-gray-900">Nach Vereinbarung</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sonntag</span>
                    <span className="text-gray-900">Geschlossen</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Wilhelmstra%C3%9Fe+17%2C+75378+Bad+Liebenzell"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full relative group"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white hover:bg-pink-50 transition-colors duration-300">
                  <div className="text-pink-500 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Unsere Location</h3>
                  <div className="text-gray-600 mb-6 space-y-1">
                    <p>Wilhelmstraße 17</p>
                    <p>75378 Bad Liebenzell</p>
                  </div>
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-pink-100 text-pink-500 font-medium group-hover:bg-pink-200 transition-colors duration-200">
                    In Google Maps öffnen
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
