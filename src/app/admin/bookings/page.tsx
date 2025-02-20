'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface Booking {
  id: string;
  customer_id: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  service_id: string;
  service: {
    name: string;
    duration: number;
    price: number;
  };
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

interface SupabaseBooking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  profile_id: string;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | null;
  services: {
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadBookings();
  }, []);

  const checkAuthAndLoadBookings = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          booking_time,
          status,
          notes,
          profile_id,
          profiles (
            id,
            first_name,
            last_name,
            email,
            phone
          ),
          services (
            id,
            name,
            duration,
            price
          )
        `)
        .order('booking_date', { ascending: false })
        .order('booking_time', { ascending: true });

      if (error) throw error;

      if (!data) {
        setBookings([]);
        return;
      }

      const formattedData = data.map((booking: any) => ({
        id: booking.id,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        status: booking.status as 'pending' | 'confirmed' | 'cancelled',
        notes: booking.notes,
        customer_id: booking.profile_id,
        customer: {
          first_name: booking.profiles?.first_name ?? '',
          last_name: booking.profiles?.last_name ?? '',
          email: booking.profiles?.email ?? '',
          phone: booking.profiles?.phone ?? ''
        },
        service_id: booking.services?.id ?? '',
        service: {
          name: booking.services?.name ?? '',
          duration: booking.services?.duration ?? 0,
          price: booking.services?.price ?? 0
        }
      })) as Booking[];
      
      setBookings(formattedData);
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
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      setError(null);
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      await loadBookings();
      toast({
        title: 'Erfolg',
        description: `Buchungsstatus wurde auf ${newStatus === 'confirmed' ? 'bestätigt' : 'storniert'} geändert`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Ändern des Status';
      console.error('Status update error:', error);
      setError(message);
      toast({
        title: 'Fehler',
        description: message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Buchungen</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-md bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      <div className="luxury-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Zeit</TableHead>
              <TableHead>Kunde</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notizen</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  {format(new Date(booking.booking_date), 'dd.MM.yyyy', { locale: de })}
                </TableCell>
                <TableCell>{booking.booking_time}</TableCell>
                <TableCell>
                  <div>
                    {booking.customer.first_name} {booking.customer.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {booking.customer.email}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {booking.customer.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <div>{booking.service.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {booking.service.duration} Min. | {booking.service.price}€
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {booking.status === 'confirmed'
                      ? 'Bestätigt'
                      : booking.status === 'cancelled'
                      ? 'Storniert'
                      : 'Ausstehend'}
                  </span>
                </TableCell>
                <TableCell>{booking.notes}</TableCell>
                <TableCell className="text-right space-x-2">
                  {booking.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(booking.id, 'confirmed')}
                      >
                        Bestätigen
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                      >
                        Stornieren
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
