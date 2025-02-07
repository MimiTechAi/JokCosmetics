'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface Booking {
  id: string;
  customer_name: string;
  service: {
    name: string;
    duration: string;
    price: string;
  };
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  date: string;
  time: string;
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
          date,
          time,
          status,
          notes,
          customer:profiles (
            first_name,
            last_name,
            email,
            phone
          ),
          service:services (
            name,
            duration,
            price
          )
        `)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;

      // Ensure all dates are valid before setting state
      const validBookings = (data || []).filter(booking => {
        try {
          // Validate date string
          const date = new Date(booking.date);
          if (isNaN(date.getTime())) {
            console.warn('Invalid date found:', booking.date);
            return false;
          }
          return true;
        } catch (e) {
          console.warn('Error parsing date:', e);
          return false;
        }
      });

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
      isSameDay(new Date(booking.date), date)
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
                      {booking.time} - {booking.service.name}
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
