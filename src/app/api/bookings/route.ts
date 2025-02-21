import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendWhatsAppNotification } from '@/lib/notifications/whatsapp';
import { sendEmailNotification } from '@/lib/notifications/email';
import { format } from 'date-fns';
import { z } from 'zod';

// Validierungsschema für die Buchungsanfrage
const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  bookingTime: z.string().regex(/^\d{2}:\d{2}$/),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const url = new URL(req.url);
    const date = url.searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Datum ist erforderlich' },
        { status: 400 }
      );
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_date,
        booking_time,
        status,
        notes,
        services (
          id,
          name,
          duration
        ),
        customers (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('booking_date', date)
      .order('booking_time');

    if (error) throw error;

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Fehler beim Abrufen der Buchungen:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const body = await req.json();
    
    // Validiere Eingabedaten
    const validatedData = bookingSchema.parse(body);

    // Transaktion starten
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert({
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone
      })
      .select()
      .single();

    if (customerError || !customer) {
      throw new Error('Fehler beim Erstellen des Kunden');
    }

    // Prüfe Service-Verfügbarkeit
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', validatedData.serviceId)
      .single();

    if (serviceError || !service) {
      throw new Error('Service nicht gefunden');
    }

    // Erstelle Buchung
    const startTime = new Date(validatedData.bookingDate);
    const [hours, minutes] = validatedData.bookingTime.split(':');
    startTime.setHours(parseInt(hours), parseInt(minutes));

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + parseInt(service.duration));

    const bookingData = {
      service_id: validatedData.serviceId,
      booking_date: validatedData.bookingDate,
      booking_time: validatedData.bookingTime,
      notes: validatedData.notes,
      status: 'pending',
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone: customer.phone || '', // Stelle sicher, dass phone ein string ist
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select(`
        id,
        booking_date,
        booking_time,
        status,
        notes,
        services (
          id,
          title,
          duration
        ),
        customers (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .single();

    if (bookingError || !booking) {
      throw new Error('Fehler beim Erstellen der Buchung');
    }

    // Erstelle Benachrichtigung
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert([{
        booking_id: parseInt(booking.id), // Konvertiere booking_id zu number
        type: 'booking_confirmation',
        status: 'pending',
        content: `Neue Buchung von ${customer.first_name} ${customer.last_name} für ${service.title}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sent_at: null
      }]);

    if (notificationError) {
      console.error('Fehler beim Erstellen der Benachrichtigungen:', notificationError);
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Fehler beim Erstellen der Buchung:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
