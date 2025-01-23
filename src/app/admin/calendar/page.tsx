'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';

interface Booking {
  id: string;
  customer_name: string;
  service: {
    name: string;
  };
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const start = startOfWeek(selectedDate, { locale: de });
    const dates = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDates(dates);
    fetchBookings();
  }, [selectedDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(name),
          customer:customers(
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .gte('booking_date', format(weekDates[0] || new Date(), 'yyyy-MM-dd'))
        .lte('booking_date', format(weekDates[6] || new Date(), 'yyyy-MM-dd'))
        .order('booking_time');

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Buchungen:', error);
      alert('Fehler beim Laden der Buchungen');
    } finally {
      setLoading(false);
    }
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      isSameDay(new Date(booking.booking_date), date)
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setSelectedDate(newDate);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-radial from-pink-100 via-purple-50 to-blue-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* Animated Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Glowing Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl mb-8">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => navigateWeek('prev')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Vorherige Woche
              </button>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                {format(weekDates[0], 'dd.MM.yyyy', { locale: de })} - {format(weekDates[6], 'dd.MM.yyyy', { locale: de })}
              </h2>
              <button
                onClick={() => navigateWeek('next')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Nächste Woche
              </button>
            </div>

            <div className="grid grid-cols-7 gap-4">
              {weekDates.map((date, index) => (
                <div key={index} className="min-h-[200px]">
                  <div className="text-center p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg">
                    <p className="font-medium">{format(date, 'EEEE', { locale: de })}</p>
                    <p className="text-sm">{format(date, 'dd.MM.', { locale: de })}</p>
                  </div>
                  <div className="bg-white/50 rounded-b-lg p-2 space-y-2">
                    {getBookingsForDate(date).map((booking) => (
                      <div
                        key={booking.id}
                        className={`p-2 mb-2 rounded-lg ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100'
                            : 'bg-yellow-100'
                        }`}
                      >
                        <p className="font-medium text-gray-900">{booking.booking_time}</p>
                        <p className="font-medium text-pink-600">
                          {booking.customer?.first_name} {booking.customer?.last_name}
                        </p>
                        {booking.service?.name && (
                          <p className="text-sm text-gray-600">Service: {booking.service.name}</p>
                        )}
                        <div className="mt-1 text-xs text-gray-500">
                          <p>{booking.customer?.email}</p>
                          <p>{booking.customer?.phone}</p>
                          {booking.notes && (
                            <p className="mt-1 italic">Notiz: {booking.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Legende</h3>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-green-100 mr-2"></div>
                <span>Bestätigt</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-yellow-100 mr-2"></div>
                <span>Ausstehend</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-red-100 mr-2"></div>
                <span>Storniert</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
