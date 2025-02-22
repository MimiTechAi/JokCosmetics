import { NextResponse } from 'next/server';
import { sendWhatsAppNotification } from '@/lib/notifications/whatsapp';
import { sendEmailNotification } from '@/lib/notifications/email';
import { createClient } from '@/utils/supabase/server';
import { BookingStatus } from '@/types/booking';

interface Booking {
  id: string;
  customer_id: string;
  service_id: string;
  booking_date: Date;
  booking_time: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes: string;
  status: BookingStatus;
  created_at: Date;
  updated_at: Date;
}

export async function POST(req: Request) {
  try {
    const { bookingId, status, customer, service, requestedDate, bookingData } = await req.json();

    const booking: Booking = {
      id: bookingData.id,
      customer_id: customer.id,
      service_id: bookingData.service_id,
      booking_date: new Date(bookingData.booking_date),
      booking_time: bookingData.booking_time,
      first_name: bookingData.first_name,
      last_name: bookingData.last_name,
      email: bookingData.email,
      phone: bookingData.phone,
      notes: bookingData.notes || '',
      status: bookingData.status,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Sende Benachrichtigungen parallel
    await Promise.all([
      sendWhatsAppNotification(booking, customer, service),
      sendEmailNotification(booking, customer, service)
    ]);

    // Speichere die Benachrichtigung in der Datenbank
    const supabase = createClient();
    await supabase
      .from('notifications')
      .insert([
        {
          type: 'whatsapp',
          recipient_id: customer.id,
          message: `Buchungsstatus: ${status}`,
          status: 'sent',
          sent_at: new Date().toISOString()
        },
        {
          type: 'email',
          recipient_id: customer.id,
          message: `Buchungsstatus: ${status}`,
          status: 'sent',
          sent_at: new Date().toISOString()
        }
      ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Senden der Benachrichtigungen:', error);
    return NextResponse.json(
      { error: 'Fehler beim Senden der Benachrichtigungen' },
      { status: 500 }
    );
  }
}
