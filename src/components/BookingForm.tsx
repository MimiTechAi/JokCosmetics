'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Service = Database['public']['Tables']['services']['Row'];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

interface BookingFormProps {
  services: Service[];
  initialServiceId?: string;
}

interface BookingDetails {
  serviceName: string;
  date: string;
  time: string;
}

const SuccessMessage = ({ onClose, bookingDetails }: { 
  onClose: () => void,
  bookingDetails: BookingDetails;
}) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 flex items-center justify-center z-50"
  >
    <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 relative z-10">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Buchung erfolgreich!</h3>
        <div className="mt-4 text-sm text-gray-600">
          <p className="font-medium">Ihre Buchungsdetails:</p>
          <p className="mt-2">Behandlung: {bookingDetails.serviceName}</p>
          <p>Datum: {bookingDetails.date}</p>
          <p>Uhrzeit: {bookingDetails.time}</p>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Eine Bestätigungsemail wurde an Ihre E-Mail-Adresse gesendet.
        </p>
        <div className="mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

export const BookingForm = ({ services, initialServiceId }: BookingFormProps) => {
  console.log('BookingForm rendered with:', { services, initialServiceId });

  const [step, setStep] = useState(initialServiceId ? 2 : 1);
  const [selectedService, setSelectedService] = useState<string>(initialServiceId || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  console.log('BookingForm rendered with services:', services?.length);

  const handleServiceSelect = (serviceId: string) => {
    console.log('Selected service:', serviceId);
    setSelectedService(serviceId);
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const selectedServiceData = services.find(s => s.id === selectedService);
      console.log('Selected service:', selectedServiceData);
      
      if (!selectedServiceData) {
        throw new Error('Selected service not found');
      }

      const booking = {
        service_id: selectedService,
        booking_date: selectedDate,
        booking_time: selectedTime,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes || ''
      };

      console.log('Attempting to create booking:', booking);

      const { data, error: bookingError } = await supabase
        .from('bookings')
        .insert([booking])
        .select('*');

      console.log('Booking response:', { data, error: bookingError });

      if (bookingError) {
        console.error('Detailed booking error:', JSON.stringify(bookingError, null, 2));
        throw bookingError;
      }

      // Send confirmation emails
      const emailResponse = await fetch('/api/send-booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking,
          service: selectedServiceData
        }),
      });

      if (!emailResponse.ok) {
        console.error('Failed to send confirmation emails');
      }

      setSuccess(true);
      setBookingDetails({
        serviceName: selectedServiceData.title,
        date: format(parseISO(selectedDate), 'd. MMMM yyyy', { locale: de }),
        time: selectedTime
      });
    } catch (err) {
      console.error('Full error object:', JSON.stringify(err, null, 2));
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              Wählen Sie Ihre Behandlung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services && services.length > 0 ? (
                services.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedService === service.id
                        ? 'border-pink-600 bg-pink-50 shadow-lg'
                        : 'border-gray-200 hover:border-pink-300 hover:shadow'
                    }`}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {service.duration}
                          </span>
                        </div>
                      </div>
                      <span className="font-medium text-pink-600 whitespace-nowrap ml-4">{service.price}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500">Keine Dienstleistungen verfügbar.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              Wählen Sie ein Datum
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(14)].map((_, i) => {
                const date = addDays(new Date(), i + 1);
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDateSelect(date.toISOString().split('T')[0])}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow text-center"
                  >
                    <div className="font-medium">
                      {format(date, 'EEEE', { locale: de })}
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(date, 'd. MMMM', { locale: de })}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              Wählen Sie eine Uhrzeit
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                <motion.button
                  key={time}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTimeSelect(time)}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow text-center"
                >
                  {time}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              Ihre Kontaktdaten
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vorname
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nachname
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  E-Mail
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefon
                </label>
                <input
                  type="tel"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Anmerkungen
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Wird gesendet...' : 'Termin buchen'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {step > 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-pink-600 hover:text-pink-700"
          onClick={() => setStep(step - 1)}
        >
          ← Zurück
        </motion.button>
      )}

      <AnimatePresence>
        {success && bookingDetails && (
          <SuccessMessage
            onClose={() => {
              setSuccess(false);
              setBookingDetails(null);
              setStep(1);
              setSelectedService('');
              setSelectedDate('');
              setSelectedTime('');
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                notes: '',
              });
            }}
            bookingDetails={bookingDetails}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
