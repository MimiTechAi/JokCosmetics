'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';

type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    preferredContact: 'whatsapp',
    notes: '',
  });

  // Lade Services beim ersten Render
  useState(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true });

      if (!error && data) {
        setServices(data);
      }
    }

    fetchServices();
  }, []);

  // Generiere Zeitslots basierend auf Öffnungszeiten
  const generateTimeSlots = () => {
    const slots = [];
    const start = 9; // 9:00
    const end = 19; // 19:00
    
    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Erstelle zuerst den Kunden
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            whatsapp: formData.whatsapp,
            preferred_contact: formData.preferredContact,
          },
        ])
        .select()
        .single();

      if (customerError) throw customerError;

      // Erstelle dann die Buchung
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            customer_id: customerData.id,
            service_id: selectedService,
            requested_date: `${selectedDate}T${selectedTime}`,
            notes: formData.notes,
            status: 'pending',
          },
        ]);

      if (bookingError) throw bookingError;

      // Erfolgreiche Buchung
      setStep(4); // Zeige Bestätigung
    } catch (error) {
      console.error('Fehler bei der Buchung:', error);
      alert('Es gab einen Fehler bei der Buchung. Bitte versuchen Sie es später erneut.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl text-center font-serif mb-8">
            Termin buchen
          </h1>

          {/* Fortschrittsanzeige */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-1/3 h-2 rounded-full mx-1 ${
                  s <= step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl mb-4">1. Behandlung wählen</h2>
              <div className="grid gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service.id);
                      setStep(2);
                    }}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedService === service.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{service.name}</h3>
                        <p className="text-sm text-gray-500">
                          Dauer: {Math.floor(service.duration / 60)}h{' '}
                          {service.duration % 60 > 0
                            ? `${service.duration % 60}min`
                            : ''}
                        </p>
                      </div>
                      <span className="text-lg font-semibold">
                        {service.price.toFixed(2)}€
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl mb-4">2. Datum & Uhrzeit wählen</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Datum
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Uhrzeit
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {generateTimeSlots().map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 rounded-lg border text-sm transition-all ${
                            selectedTime === time
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-primary'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => selectedDate && selectedTime && setStep(3)}
                  className="w-full mt-4 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  disabled={!selectedDate || !selectedTime}
                >
                  Weiter
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl mb-4">3. Kontaktdaten</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Vorname
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nachname
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    WhatsApp (falls abweichend)
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bevorzugter Kontaktweg
                  </label>
                  <select
                    value={formData.preferredContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredContact: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">E-Mail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Anmerkungen
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Termin buchen
                </button>
              </form>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-serif mb-4">
                Buchung erfolgreich!
              </h2>
              <p className="text-gray-600 mb-8">
                Wir haben Ihre Buchungsanfrage erhalten und werden uns in Kürze bei
                Ihnen melden.
              </p>
              <Link
                href="/"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Zurück zur Startseite
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
