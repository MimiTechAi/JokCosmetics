import { NextResponse } from 'next/server';
import { sendWhatsAppNotification } from '@/lib/notifications/whatsapp';
import { sendEmailNotification } from '@/lib/notifications/email';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { bookingId, status, customer, service, requestedDate } = await req.json();

    const booking = {
      id: bookingId,
      requested_date: requestedDate,
      status,
      notes: ''
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
