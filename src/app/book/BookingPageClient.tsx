'use client';

import { useState } from 'react';
import { BookingForm } from '@/components/BookingForm';
import { PageContainer } from '@/components/PageContainer';
import { PriceList } from '@/components/PriceList';
import { motion, AnimatePresence } from 'framer-motion';

interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  category_id: string;
  service_categories: {
    id: string;
    name: string;
  } | null;
}

interface BookingPageClientProps {
  services: Service[];
}

export function BookingPageClient({ services }: BookingPageClientProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleServiceSelect = (serviceId: string) => {
    // Überprüfen, ob die serviceId ein Name oder eine ID ist
    // Wenn es ein Name ist, versuchen wir, den entsprechenden Service zu finden
    let actualServiceId = serviceId;
    
    // Überprüfen, ob die serviceId tatsächlich ein Name ist
    const serviceByName = services.find(s => s.title === serviceId);
    if (serviceByName) {
      actualServiceId = serviceByName.id;
      console.log(`Service gefunden mit Name "${serviceId}": ID = ${actualServiceId}`);
    } else {
      console.log(`Verwende direkt die Service-ID: ${serviceId}`);
    }
    
    setSelectedServiceId(actualServiceId);
    setShowBookingForm(true);
    
    // Scroll zum Buchungsformular mit Animation
    setTimeout(() => {
      const bookingForm = document.getElementById('booking-form');
      if (bookingForm) {
        bookingForm.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl font-bold gradient-text mb-6"
            >
              Buchen Sie Ihren Termin
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-gray-600 text-xl mb-8 max-w-3xl mx-auto"
            >
              Wählen Sie Ihre gewünschte Behandlung und buchen Sie direkt online
            </motion.p>
          </div>

          {/* Schrittanzeige */}
          <div className="mb-12">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!showBookingForm ? 'bg-pink-600 text-white' : 'bg-pink-200 text-pink-800'} font-bold`}>
                    1
                  </div>
                  <span className="text-sm mt-2">Behandlung wählen</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${showBookingForm ? 'bg-pink-600' : 'bg-pink-200'}`}></div>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${showBookingForm ? 'bg-pink-600 text-white' : 'bg-pink-200 text-pink-800'} font-bold`}>
                    2
                  </div>
                  <span className="text-sm mt-2">Termin buchen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preisliste und Buchungsformular */}
          <AnimatePresence mode="wait">
            {!showBookingForm ? (
              <motion.div 
                key="price-list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90"
              >
                <PriceList onServiceSelect={handleServiceSelect} />
              </motion.div>
            ) : (
              <motion.div 
                key="booking-form"
                id="booking-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90"
              >
                <div className="mb-6 flex justify-between items-center">
                  <button 
                    onClick={() => setShowBookingForm(false)}
                    className="flex items-center text-pink-600 hover:text-pink-800 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Zurück zur Übersicht
                  </button>
                  <div className="text-sm text-gray-500">
                    {selectedServiceId && services.find(s => s.id === selectedServiceId)?.title}
                  </div>
                </div>
                <BookingForm 
                  services={services} 
                  preSelectedServiceId={selectedServiceId || ''} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageContainer>
  );
}
