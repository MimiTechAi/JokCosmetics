'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Service, createBooking, getAvailableTimeSlots } from '@/lib/supabase/client';

const BookingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service_id: '',
    date: '',
    time: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    preferred_contact: 'whatsapp',
    notes: ''
  });

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const handleDateChange = async (date: string) => {
    if (formData.service_id) {
      const slots = await getAvailableTimeSlots(formData.service_id, new Date(date));
      setAvailableSlots(slots);
    }
    setFormData({ ...formData, date });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requestedDate = new Date(`${formData.date}T${formData.time}`);
    
    const customerData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      preferred_contact: formData.preferred_contact as 'email' | 'whatsapp'
    };

    const result = await createBooking(
      formData.service_id,
      requestedDate,
      customerData
    );

    if (result.success) {
      // Erfolgsbenachrichtigung anzeigen
      alert('Ihre Buchungsanfrage wurde erfolgreich gesendet!');
    } else {
      // Fehlerbenachrichtigung anzeigen
      alert('Es ist ein Fehler aufgetreten: ' + result.error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-serif mb-6">Wählen Sie eine Behandlung</h3>
            {/* Service-Auswahl hier */}
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary w-full"
            >
              Weiter zur Terminauswahl
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-serif mb-6">Wählen Sie einen Termin</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Datum
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            
            {availableSlots.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verfügbare Zeiten
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Zeit auswählen</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={new Date(slot).toLocaleTimeString()}>
                      {new Date(slot).toLocaleTimeString()}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn-primary w-full"
            >
              Weiter zu Ihren Daten
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-serif mb-6">Ihre Kontaktdaten</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vorname
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nachname
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp (optional)
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bevorzugter Kontaktweg
              </label>
              <select
                value={formData.preferred_contact}
                onChange={(e) => setFormData({ ...formData, preferred_contact: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="email">E-Mail</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full">
              Termin anfragen
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default BookingForm;
