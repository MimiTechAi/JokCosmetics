'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceCategory {
  id: string;
  name: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  category_id: string;
  service_categories: ServiceCategory | null;
}

interface BookingFormProps {
  services: Service[];
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export function BookingForm({ services }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    service_id: '',
    date: '',
    time: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Gruppiere Services nach Kategorien
  const servicesByCategory = services.reduce((acc, service) => {
    const categoryName = service.service_categories?.name || 'Andere';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 4) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Submitting form data:', formData);

      // 1. Erstelle die Buchung
      const bookingData = {
        booking_date: formData.date,
        booking_time: formData.time,
        service_id: formData.service_id,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        notes: formData.notes || '',
        status: 'pending'
      };

      console.log('Attempting to create booking with:', bookingData);

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData);

      if (bookingError) {
        console.error('Booking error:', bookingError);
        throw bookingError;
      }

      // 2. Sende Bestätigungs-E-Mails
      const selectedService = services.find(s => s.id === formData.service_id);
      
      const emailData = {
        customerEmail: formData.email,
        customerName: `${formData.first_name} ${formData.last_name}`,
        bookingDate: formData.date,
        bookingTime: formData.time,
        serviceName: selectedService?.title || '',
        servicePrice: selectedService?.price || 0,
        serviceDuration: selectedService?.duration || '',
        phone: formData.phone,
        notes: formData.notes || ''
      };

      const response = await fetch('/api/send-booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to send confirmation email:', errorData);
        // Wir werfen hier keinen Fehler, da die Buchung bereits erfolgreich war
      }

      // Erfolgsmeldung
      setStep(5);
    } catch (error: any) {
      console.error('Full error object:', error);
      setError(
        error.message || 
        'Es gab einen Fehler bei der Buchung. Bitte versuchen Sie es später erneut.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-6">Wählen Sie Ihre Behandlung</h2>
            <div className="space-y-8">
              {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-xl font-medium text-pink-600">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryServices.map((service) => (
                      <motion.div
                        key={service.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          formData.service_id === service.id
                            ? 'border-pink-600 bg-pink-50 shadow-lg'
                            : 'border-gray-200 hover:border-pink-300 hover:shadow'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, service_id: service.id }));
                          nextStep();
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{service.title}</h4>
                            {service.description && (
                              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-gray-600">
                                {service.duration} Min
                              </span>
                            </div>
                          </div>
                          <span className="font-medium text-pink-600">{service.price}€</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-6">Wählen Sie ein Datum</h2>
            <div className="max-w-md mx-auto">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={format(new Date(), 'yyyy-MM-dd')}
                max={format(new Date(2025, 11, 31), 'yyyy-MM-dd')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
                title="Wählen Sie ein Datum"
                placeholder="Wählen Sie ein Datum"
              />
            </div>
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="text-pink-600 hover:text-pink-700"
              >
                ← Zurück
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.date}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
              >
                Weiter →
              </button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-6">Wählen Sie eine Uhrzeit</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {timeSlots.map((time) => (
                <motion.button
                  key={time}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, time }));
                    nextStep();
                  }}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    formData.time === time
                      ? 'border-pink-600 bg-pink-50 text-pink-600'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  {time} Uhr
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="text-pink-600 hover:text-pink-700"
              >
                ← Zurück
              </button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-6">Ihre Kontaktdaten</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Vorname</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                  minLength={2}
                  title="Ihr Vorname"
                  placeholder="Vorname eingeben"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nachname</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                  minLength={2}
                  title="Ihr Nachname"
                  placeholder="Nachname eingeben"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">E-Mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                  title="Ihre E-Mail-Adresse"
                  placeholder="E-Mail eingeben"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telefon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                  minLength={6}
                  title="Ihre Telefonnummer"
                  placeholder="Telefonnummer eingeben"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Anmerkungen</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows={3}
                title="Zusätzliche Anmerkungen"
                placeholder="Optionale Anmerkungen zur Buchung"
              />
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="text-pink-600 hover:text-pink-700"
              >
                ← Zurück
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Wird gesendet...' : 'Termin buchen'}
              </button>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Buchung erfolgreich!</h2>
            <p className="text-gray-600 mb-8">
              Vielen Dank für Ihre Buchung. Sie erhalten in Kürze eine Bestätigung per E-Mail.
            </p>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setFormData({
                  service_id: '',
                  date: '',
                  time: '',
                  first_name: '',
                  last_name: '',
                  email: '',
                  phone: '',
                  notes: ''
                });
              }}
              className="text-pink-600 hover:text-pink-700"
            >
              Neue Buchung erstellen
            </button>
          </motion.div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {renderStepContent()}
      </AnimatePresence>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
    </form>
  );
}
