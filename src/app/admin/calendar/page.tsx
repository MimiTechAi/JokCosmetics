'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface Booking {
  id: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  service: {
    name: string;
    duration: string;
    price: string;
  };
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const start = startOfWeek(selectedDate, { locale: de });
    const dates = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDates(dates);
    loadBookings();
  }, [selectedDate]);

  const checkAuthAndFetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile?.role || profile.role !== 'admin') {
        router.push('/auth/login');
        return;
      }

      await loadBookings();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler bei der Authentifizierung';
      console.error('Auth error:', error);
      setError(message);
      toast({
        title: 'Fehler',
        description: message,
        variant: 'destructive',
      });
      router.push('/auth/login');
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Format dates for database query
      const startDate = format(weekDates[0], 'yyyy-MM-dd');
      const endDate = format(weekDates[6], 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          booking_time,
          status,
          notes
        `)
        .gte('booking_date', startDate)
        .lte('booking_date', endDate)
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });

      // Check for errors
      if (error) throw error;

      // Update validBookings without profile_id and service_id
      const validBookings = (data || []).map(booking => ({
        id: booking.id,
        customer: {
          first_name: '', // Placeholder as we cannot get this info
          last_name: '',
          email: '',
          phone: ''
        },
        service: {
          name: '', // Placeholder as we cannot get this info
          duration: '',
          price: ''
        },
        booking_date: booking.booking_date || '',
        booking_time: booking.booking_time || '',
        status: (booking.status as 'pending' | 'confirmed' | 'cancelled') || 'pending',
        notes: booking.notes || ''
      }));

      setBookings(validBookings);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Laden der Buchungen';
      console.error('Bookings error:', error);
      setError(message);
      toast({
        title: 'Fehler',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd.MM.yyyy', { locale: de });
    } catch (e) {
      console.warn('Error formatting date:', dateStr, e);
      return 'Ungültiges Datum';
    }
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      isSameDay(new Date(booking.booking_date), date)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Terminkalender</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-md bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      <div className="luxury-card">
        <div className="grid grid-cols-7 gap-4">
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                isSameDay(date, selectedDate)
                  ? 'bg-primary/10'
                  : 'hover:bg-primary/5'
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="text-sm font-medium mb-2">
                {format(date, 'EEEE', { locale: de })}
              </div>
              <div className="text-lg font-bold mb-4">
                {format(date, 'd. MMMM', { locale: de })}
              </div>
              <div className="space-y-2">
                {getBookingsForDate(date).map((booking) => (
                  <div
                    key={booking.id}
                    className="p-2 rounded-md bg-background shadow-sm"
                  >
                    <div className="text-sm font-medium">
                      {booking.booking_time} - {booking.service.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking.customer.first_name} {booking.customer.last_name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
