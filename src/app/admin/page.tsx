'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/de';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('de');
const localizer = momentLocalizer(moment);

type Booking = {
  id: string;
  requested_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  customers: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    whatsapp: string;
  }[];
  services: {
    name: string;
    duration: number;
    price: number;
  }[];
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          requested_date,
          status,
          notes,
          customers (
            first_name,
            last_name,
            email,
            phone,
            whatsapp
          ),
          services (
            name,
            duration,
            price
          )
        `);

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Buchungen:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateBookingStatus(id: string, status: Booking['status']) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // Aktualisiere die lokale Buchungsliste
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      ));

      // Optional: Sende Benachrichtigung an den Kunden
      if (status === 'confirmed') {
        // TODO: Implementiere Benachrichtigungssystem
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error);
    }
  }

  const calendarEvents = bookings.map(booking => ({
    id: booking.id,
    title: `${booking.services[0].name} - ${booking.customers[0].first_name} ${booking.customers[0].last_name}`,
    start: new Date(booking.requested_date),
    end: new Date(new Date(booking.requested_date).getTime() + booking.services[0].duration * 60000),
    resource: booking
  }));

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-lg ${
                view === 'calendar'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600'
              }`}
            >
              Kalender
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg ${
                view === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600'
              }`}
            >
              Liste
            </button>
          </div>
        </div>

        {view === 'calendar' ? (
          <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: '700px' }}>
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={(event) => setSelectedBooking(event.resource)}
              style={{ height: '100%' }}
              messages={{
                next: "Vor",
                previous: "Zurück",
                today: "Heute",
                month: "Monat",
                week: "Woche",
                day: "Tag"
              }}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} onClick={() => setSelectedBooking(booking)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {moment(booking.requested_date).format('DD.MM.YYYY HH:mm')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customers[0].first_name} {booking.customers[0].last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.customers[0].email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {booking.services[0].name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.services[0].duration} Min. | {booking.services[0].price}€
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Bestätigen
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Ablehnen
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Abschließen
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Buchungsdetails Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-serif">
                  Buchungsdetails
                </h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Kunde</h3>
                  <p>{selectedBooking.customers[0].first_name} {selectedBooking.customers[0].last_name}</p>
                  <p className="text-sm text-gray-500">{selectedBooking.customers[0].email}</p>
                  {selectedBooking.customers[0].phone && (
                    <p className="text-sm text-gray-500">Tel: {selectedBooking.customers[0].phone}</p>
                  )}
                  {selectedBooking.customers[0].whatsapp && (
                    <p className="text-sm text-gray-500">WhatsApp: {selectedBooking.customers[0].whatsapp}</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium">Service</h3>
                  <p>{selectedBooking.services[0].name}</p>
                  <p className="text-sm text-gray-500">
                    Dauer: {selectedBooking.services[0].duration} Min. | 
                    Preis: {selectedBooking.services[0].price}€
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Termin</h3>
                  <p>{moment(selectedBooking.requested_date).format('DD.MM.YYYY HH:mm')}</p>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <h3 className="font-medium">Anmerkungen</h3>
                    <p className="text-sm text-gray-600">{selectedBooking.notes}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-medium">Status</h3>
                  <div className="flex gap-2 mt-2">
                    {Object.keys(statusColors).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateBookingStatus(selectedBooking.id, status as Booking['status'])}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedBooking.status === status
                            ? statusColors[status as keyof typeof statusColors]
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
