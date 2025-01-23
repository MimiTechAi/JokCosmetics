'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSupabase } from '@/components/providers/supabase-provider';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { format, addDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Database } from '@/types/database';

type Service = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  image_url?: string;
  is_active: boolean;
  available_days: string[];
};

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

const SuccessMessage = ({ onClose, bookingDetails }: { 
  onClose: () => void,
  bookingDetails: {
    serviceName: string;
    date: string;
    time: string;
  }
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
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}

const BookingPageContent = () => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    serviceName: string;
    date: string;
    time: string;
  } | null>(null);
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('category', { ascending: true });

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error('Error loading services:', error);
        setError('Fehler beim Laden der Services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [supabase]);

  const handleServiceSelect = (serviceId: string) => {
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
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('id', selectedService)
        .single();

      if (serviceError) {
        console.error('Service error:', serviceError);
        throw new Error('Service konnte nicht gefunden werden');
      }

      const [hours, minutes] = selectedTime.split(':');
      const startTime = new Date(selectedDate);
      startTime.setHours(parseInt(hours), parseInt(minutes));

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + (service?.duration || 60));

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          service_id: selectedService,
          customer_email: formData.email,
          customer_first_name: formData.firstName,
          customer_last_name: formData.lastName,
          customer_phone: formData.phone || null,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          notes: formData.notes,
          status: 'pending'
        });

      if (bookingError) {
        console.error('Booking error:', bookingError);
        throw new Error('Fehler bei der Buchung');
      }

      const formattedDate = format(startTime, 'dd. MMMM yyyy', { locale: de });
      const formattedTime = format(startTime, 'HH:mm', { locale: de });

      const notificationResponse = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          serviceName: service.name,
          serviceDate: formattedDate,
          serviceTime: formattedTime,
          customerPhone: formData.phone,
          notes: formData.notes
        }),
      });

      if (!notificationResponse.ok) {
        console.error('Notification error:', await notificationResponse.text());
      }

      setBookingDetails({
        serviceName: service.name,
        date: formattedDate,
        time: formattedTime
      });

      setSuccess(true);
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        notes: '',
      });
      setSelectedService('');
      setSelectedDate('');
      setSelectedTime('');
      setStep(1);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setError(error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableDates = () => {
    const dates = [];
    const startDate = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = addDays(startDate, i);
      if (date.getDay() !== 0) {
        dates.push(format(date, 'yyyy-MM-dd'));
      }
    }
    return dates;
  };

  const getAvailableTimes = () => {
    return [
      '10:00', '11:00', '12:00', '13:00', '14:00', 
      '15:00', '16:00', '17:00', '18:00'
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
            Termin buchen
          </h1>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`flex items-center ${
                    stepNumber < 4 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= stepNumber
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step > stepNumber
                          ? 'bg-pink-600'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm">Service</span>
              <span className="text-sm">Datum</span>
              <span className="text-sm">Uhrzeit</span>
              <span className="text-sm">Details</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-pink-600 font-medium">
                        {service.price}€
                      </span>
                      <span className="text-gray-500">
                        {service.duration} Min.
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {getAvailableDates().map((date) => (
                  <motion.button
                    key={date}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDateSelect(date)}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow text-center"
                  >
                    <div className="font-medium">
                      {format(parseISO(date), 'EEEE', { locale: de })}
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(parseISO(date), 'd. MMMM', { locale: de })}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {getAvailableTimes().map((time) => (
                  <motion.button
                    key={time}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTimeSelect(time)}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                  >
                    {time}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
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

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500 ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Wird gesendet...' : 'Termin buchen'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {step > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 flex justify-start"
            >
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-pink-600 hover:text-pink-700 focus:outline-none"
              >
                ← Zurück
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {success && bookingDetails && (
          <SuccessMessage 
            onClose={() => {
              setSuccess(false);
              setBookingDetails(null);
            }} 
            bookingDetails={bookingDetails}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
