import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const bookingId = params.id;

    // Hole Buchungsdetails
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        customers (
          first_name,
          last_name,
          email,
          phone
        ),
        services (
          name,
          duration,
          price
        )
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError) throw bookingError;
    if (!booking) throw new Error('Buchung nicht gefunden');

    // Aktualisiere Buchungsstatus
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId);

    if (updateError) throw updateError;

    // Sende Bestätigungs-E-Mail an den Kunden
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: booking.customers.email,
        subject: 'Ihre Buchung bei JOK Cosmetics wurde bestätigt',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #f8bbd0; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #fff; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .info { margin: 15px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
                .footer { margin-top: 20px; text-align: center; color: #666; }
                .confirmation { background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>Ihre Buchung wurde bestätigt!</h2>
                </div>
                <div class="content">
                  <p>Sehr geehrte(r) ${booking.customers.first_name} ${booking.customers.last_name},</p>
                  
                  <div class="confirmation">
                    <p>Wir freuen uns, Ihnen mitteilen zu können, dass Ihr Termin bestätigt wurde!</p>
                  </div>
                  
                  <div class="info">
                    <h3>Ihre Buchungsdetails:</h3>
                    <p><strong>Service:</strong> ${booking.services.name}</p>
                    <p><strong>Datum:</strong> ${new Date(booking.requested_date).toLocaleDateString('de-DE')}</p>
                    <p><strong>Uhrzeit:</strong> ${new Date(booking.requested_date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</p>
                    <p><strong>Preis:</strong> ${booking.services.price}€</p>
                  </div>

                  <h3>Wichtige Informationen:</h3>
                  <ul>
                    <li>Bitte erscheinen Sie pünktlich zu Ihrem Termin</li>
                    <li>Bei Verhinderung bitten wir Sie, mindestens 24 Stunden vorher abzusagen</li>
                    <li>Die Behandlungsdauer beträgt ca. ${booking.services.duration} Minuten</li>
                  </ul>

                  <p>Bei Fragen können Sie uns jederzeit kontaktieren:</p>
                  <ul>
                    <li>Telefon: 07052 9326388</li>
                    <li>E-Mail: thansuda22@googlemail.com</li>
                  </ul>
                  
                  <p>Wir freuen uns auf Ihren Besuch!</p>
                  
                  <p>Mit freundlichen Grüßen<br>Ihr JOK Cosmetics Team</p>
                </div>
                <div class="footer">
                  <p>© 2025 JOK Cosmetics. Alle Rechte vorbehalten.</p>
                  <p>Calmbacher Str. 22, 75378 Bad Liebenzell</p>
                </div>
              </div>
            </body>
          </html>
        `
      })
    });

    if (!response.ok) {
      throw new Error('Fehler beim Senden der Bestätigungs-E-Mail');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fehler bei der Buchungsbestätigung:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
