import { createTransport } from 'nodemailer';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Supabase Client initialisieren
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Wichtig: Service Role Key verwenden!
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// E-Mail-Transporter erstellen
const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function processNotifications() {
  try {
    // Hole unverarbeitete Benachrichtigungen
    const { data: notifications, error: fetchError } = await supabase
      .from('notification_queue')
      .select(`
        *,
        bookings (
          id,
          client_name,
          client_email,
          client_phone,
          service_type,
          booking_date,
          booking_time,
          notes
        )
      `)
      .eq('sent', false)
      .limit(10);

    if (fetchError) {
      console.error('Fehler beim Laden der Benachrichtigungen:', fetchError);
      return;
    }

    console.log('Gefundene Benachrichtigungen:', notifications);

    for (const notification of notifications || []) {
      try {
        const booking = notification.bookings;
        
        if (!booking) {
          console.error('Keine Buchungsdaten gefunden für Notification:', notification.id);
          continue;
        }

        // E-Mail senden
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: notification.recipient,
          subject: notification.message_template === 'new_booking_admin' 
            ? `Neue Buchung von ${booking.client_name}`
            : 'Ihre Buchung bei JOK Cosmetics',
          text: notification.message_template === 'new_booking_admin'
            ? `
🌟 Neue Buchung bei JOK Cosmetics 🌟

📅 Termin: ${format(new Date(booking.booking_date), 'dd.MM.yyyy', { locale: de })}
⏰ Zeit: ${booking.booking_time} Uhr
👤 Kunde: ${booking.client_name}
📱 Telefon: ${booking.client_phone}
📧 E-Mail: ${booking.client_email}
💅 Service: ${booking.service_type}
${booking.notes ? `📝 Anmerkungen: ${booking.notes}` : ''}

WhatsApp: https://wa.me/${booking.client_phone.replace(/[^0-9]/g, '')}
`
            : `
🌟 Ihre Buchung bei JOK Cosmetics 🌟

Vielen Dank für Ihre Buchung! 

📅 Ihr Termin: ${format(new Date(booking.booking_date), 'dd.MM.yyyy', { locale: de })}
⏰ Uhrzeit: ${booking.booking_time} Uhr
💅 Service: ${booking.service_type}

Sie erhalten in Kürze eine Bestätigung von uns.

Bei Fragen erreichen Sie uns unter:
📱 Telefon: +49 173 5390928
💬 WhatsApp: https://wa.me/491735390928
📧 E-Mail: thansuda22@googlemail.com

Ihr JOK Cosmetics Team
`
        });

        // Benachrichtigung als gesendet markieren
        const { error: updateError } = await supabase
          .from('notification_queue')
          .update({ 
            sent: true,
            sent_at: new Date().toISOString()
          })
          .eq('id', notification.id);

        if (updateError) {
          console.error('Fehler beim Aktualisieren der Benachrichtigung:', updateError);
        }

      } catch (error) {
        console.error('Fehler beim Verarbeiten der Benachrichtigung:', error);
      }
    }
  } catch (error) {
    console.error('Fehler bei der Benachrichtigungsverarbeitung:', error);
    throw error;
  }
}

export async function GET() {
  try {
    await processNotifications();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fehler bei der Benachrichtigungsverarbeitung:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

// Diese Route wird nicht mehr benötigt, da wir jetzt den Datenbank-Trigger verwenden
export async function POST() {
  return NextResponse.json({ error: 'Diese Route wird nicht mehr verwendet' }, { status: 410 });
}
