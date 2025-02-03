import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Booking {
  id: string;
  date: string;
  time: string;
  customer: string;
  email: string;
  service_id: string;
  service?: Service;
  status: string;
  notes?: string;
}

export function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(*)
        `)
        .order('date', { ascending: true });

      if (bookingsError) throw bookingsError;

      if (bookingsData) {
        setBookings(bookingsData);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Buchungen:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (booking: Booking, action: string) => {
    setSelectedBooking(booking);
    try {
      switch (action) {
        case "edit":
          // Bearbeiten-Logik
          break;
        case "reschedule":
          // Termin verschieben Logik
          break;
        case "copy":
          // Kopieren Logik
          break;
        case "cancel":
          const { error } = await supabase
            .from('bookings')
            .update({ status: 'Storniert' })
            .eq('id', booking.id);
          
          if (error) throw error;
          await fetchBookings();
          break;
        case "invoice":
          // Abrechnen Logik
          break;
        case "report":
          // Report Logik
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Fehler bei der Aktion ${action}:`, error);
    }
  };

  if (isLoading) {
    return <div>Lade Buchungen...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Buchungsverwaltung</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Datum</th>
              <th className="px-4 py-2">Zeit</th>
              <th className="px-4 py-2">Kunde</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b">
                <td className="px-4 py-2">{booking.date}</td>
                <td className="px-4 py-2">{booking.time}</td>
                <td className="px-4 py-2">{booking.customer}</td>
                <td className="px-4 py-2">{booking.service?.name}</td>
                <td className="px-4 py-2">{booking.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleAction(booking, "edit")}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => handleAction(booking, "cancel")}
                    className="text-red-600 hover:text-red-800"
                  >
                    Stornieren
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
