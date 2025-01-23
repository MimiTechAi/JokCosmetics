'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';

interface Service {
  name: string;
  duration: number;
  price: number;
}

interface Booking {
  id: string;
  start_time: string;
  status: string;
  services: Service;
}

interface SupabaseBooking {
  id: string;
  start_time: string;
  status: string;
  services: Service[];
}

export default function ManageBookingPage() {
  const [email, setEmail] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const searchBookings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('bookings')
        .select(`
          id,
          start_time,
          status,
          services (
            name,
            duration,
            price
          )
        `)
        .order('start_time', { ascending: true });

      if (email) {
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('email', email)
          .single();

        if (customer) {
          query = query.eq('customer_id', customer.id);
        }
      }

      if (bookingId) {
        query = query.eq('id', bookingId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Konvertiere die Supabase-Antwort in das richtige Format
      const formattedBookings: Booking[] = (data || []).map((booking: SupabaseBooking) => ({
        id: booking.id,
        start_time: booking.start_time,
        status: booking.status,
        services: booking.services[0] // Nehme den ersten Service, da wir nur einen erwarten
      }));
      
      setBookings(formattedBookings);
    } catch (error) {
      console.error('Fehler beim Laden der Buchungen:', error);
      toast({
        title: 'Fehler',
        description: 'Buchungen konnten nicht geladen werden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;

    try {
      const response = await fetch('/api/booking/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          cancellationReason,
        }),
      });

      if (!response.ok) {
        throw new Error('Stornierung fehlgeschlagen');
      }

      toast({
        title: 'Erfolgreich',
        description: 'Ihre Buchung wurde storniert.',
      });

      // Aktualisiere die Buchungsliste
      setBookings(bookings.map(booking =>
        booking.id === selectedBooking.id
          ? { ...booking, status: 'cancelled' }
          : booking
      ));

      setShowCancelDialog(false);
      setSelectedBooking(null);
      setCancellationReason('');
    } catch (error) {
      console.error('Fehler bei der Stornierung:', error);
      toast({
        title: 'Fehler',
        description: 'Die Buchung konnte nicht storniert werden.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Bestätigt';
      case 'cancelled':
        return 'Storniert';
      case 'completed':
        return 'Abgeschlossen';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-light text-center mb-8">
            Buchungen <span className="font-medium">verwalten</span>
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail-Adresse
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre@email.de"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buchungs-ID (optional)
                </label>
                <Input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="Buchungs-ID"
                />
              </div>
            </div>
            <Button
              onClick={searchBookings}
              disabled={loading || (!email && !bookingId)}
              className="w-full"
            >
              {loading ? 'Lädt...' : 'Buchungen suchen'}
            </Button>
          </div>

          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{booking.services.name}</h3>
                      <p className="text-gray-600">
                        {format(new Date(booking.start_time), 'PPP', { locale: de })} um{' '}
                        {format(new Date(booking.start_time), 'HH:mm')} Uhr
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </div>

                  {booking.status === 'confirmed' && (
                    <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          Termin stornieren
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Termin stornieren</DialogTitle>
                          <DialogDescription>
                            Bitte geben Sie einen Grund für die Stornierung an.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <Textarea
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            placeholder="Grund für die Stornierung"
                            className="min-h-[100px]"
                          />
                          <div className="flex justify-end gap-4">
                            <Button
                              variant="outline"
                              onClick={() => setShowCancelDialog(false)}
                            >
                              Abbrechen
                            </Button>
                            <Button
                              onClick={handleCancel}
                              disabled={!cancellationReason}
                            >
                              Stornieren
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            email && (
              <p className="text-center text-gray-600">
                Keine Buchungen gefunden.
              </p>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
}
