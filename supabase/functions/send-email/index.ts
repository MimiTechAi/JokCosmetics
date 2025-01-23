import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.0';
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { render } from 'https://deno.land/x/eta@v2.2.0/mod.ts';
import { EtaConfig } from 'https://deno.land/x/eta@v2.2.0/config.ts';

const STUDIO_EMAIL = Deno.env.get('STUDIO_EMAIL') || 'studio@example.com';
const SMTP_HOST = Deno.env.get('SMTP_HOST') || '';
const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT') || '587');
const SMTP_USERNAME = Deno.env.get('SMTP_USERNAME') || '';
const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD') || '';

// HTML-Templates direkt im Code
const templates = {
  'cancellation-customer.html': `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stornierungsbestätigung - JOK Cosmetics</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4; -webkit-font-smoothing: antialiased;">
    <div style="max-width: 600px; margin: 20px auto; padding: 0; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; padding: 40px 0; background-color: #4A154B; background-image: linear-gradient(135deg, #4A154B, #D4AF37);">
            <img src="https://jok-cosmetics.de/images/logo/jok-logo.png" alt="JOK Cosmetics Logo" style="max-width: 180px; height: auto; margin-bottom: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
            <h1 style="color: white; margin: 0; font-size: 32px; letter-spacing: -0.5px;">Stornierungsbestätigung</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #4A154B; font-size: 28px; letter-spacing: -0.5px;">Ihr Termin wurde storniert</h2>
            <p>Sehr geehrte(r) <%= customer_name %>,</p>
            <p>hiermit bestätigen wir die Stornierung Ihres Termins:</p>
            
            <!-- Booking Details -->
            <div style="background-color: #f9f5ff; padding: 30px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #4A154B; box-shadow: 0 2px 12px rgba(74, 21, 75, 0.1);">
                <h2 style="color: #4A154B; margin-top: 0; font-size: 24px; letter-spacing: -0.5px;">Stornierte Buchung</h2>
                <p><strong>Service:</strong> <%= service_name %></p>
                <p><strong>Datum:</strong> <%= booking_date %></p>
            </div>

            <p>Sie können jederzeit einen neuen Termin über unsere Website buchen.</p>

            <!-- Button -->
            <div style="text-align: center;">
                <a href="https://jok-cosmetics.de/book" style="display: inline-block; padding: 16px 36px; background-color: #4A154B; background-image: linear-gradient(135deg, #4A154B, #D4AF37); color: white; text-decoration: none; border-radius: 30px; margin: 25px 0; font-weight: bold; text-align: center; box-shadow: 0 4px 12px rgba(74, 21, 75, 0.2);">
                    Neuen Termin buchen
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 40px 30px; background-color: #f9f5ff; color: #333333;">
            <div style="margin: 25px 0; line-height: 1.8;">
                <strong>JOK Cosmetics</strong><br>
                Tel: +49 173 5390 9280<br>
                Email: info@jok-cosmetics.de<br>
                Web: <a href="https://jok-cosmetics.de" style="color: #4A154B;">www.jok-cosmetics.de</a>
            </div>
            <p><small>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</small></p>
        </div>
    </div>
</body>
</html>`,
  'cancellation-studio.html': `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Termin storniert</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4; -webkit-font-smoothing: antialiased;">
    <div style="max-width: 600px; margin: 20px auto; padding: 0; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; padding: 40px 0; background-color: #4A154B; background-image: linear-gradient(135deg, #4A154B, #D4AF37);">
            <img src="https://jok-cosmetics.de/images/logo/jok-logo.png" alt="JOK Cosmetics Logo" style="max-width: 180px; height: auto; margin-bottom: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
            <h1 style="color: white; margin: 0; font-size: 32px; letter-spacing: -0.5px;">Termin storniert</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <!-- Booking Details -->
            <div style="background-color: #f9f5ff; padding: 30px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #4A154B; box-shadow: 0 2px 12px rgba(74, 21, 75, 0.1);">
                <h2 style="color: #4A154B; margin-top: 0; font-size: 24px; letter-spacing: -0.5px;">Stornierte Buchung</h2>
                <p><strong>Service:</strong> <%= service_name %></p>
                <p><strong>Datum:</strong> <%= booking_date %></p>
                <p><strong>Dauer:</strong> <%= service_duration %> Minuten</p>
                <p><strong>Preis:</strong> <%= service_price %> €</p>
            </div>

            <!-- Customer Info -->
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(74, 21, 75, 0.1);">
                <h3 style="color: #4A154B; margin-top: 0; font-size: 20px; letter-spacing: -0.5px;">Kundendetails</h3>
                <p><strong>Name:</strong> <%= customer_name %></p>
                <p><strong>E-Mail:</strong> <%= customer_email %></p>
                <p><strong>Telefon:</strong> <%= customer_phone %></p>
                <p><strong>Stornierungsgrund:</strong> <%= cancellation_reason %></p>
            </div>

            <!-- Button -->
            <div style="text-align: center;">
                <a href="https://jok-cosmetics.de/admin/bookings" style="display: inline-block; padding: 16px 36px; background-color: #4A154B; background-image: linear-gradient(135deg, #4A154B, #D4AF37); color: white; text-decoration: none; border-radius: 30px; margin: 25px 0; font-weight: bold; text-align: center; box-shadow: 0 4px 12px rgba(74, 21, 75, 0.2);">
                    Buchungen verwalten
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 30px; background-color: #f9f5ff; color: #333333;">
            <p style="margin: 0;"><small>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</small></p>
        </div>
    </div>
</body>
</html>`,
  'customer-email.html': `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ihre Buchung bei JOK Cosmetics</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4; -webkit-font-smoothing: antialiased;">
    <div style="max-width: 600px; margin: 20px auto; padding: 0; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; padding: 40px 0; background-color: #4A154B; background-image: linear-gradient(135deg, #4A154B, #D4AF37);">
            <img src="https://jok-cosmetics.de/images/logo/jok-logo.png" alt="JOK Cosmetics Logo" style="max-width: 180px; height: auto; margin-bottom: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
            <h1 style="color: white; margin: 0; font-size: 32px; letter-spacing: -0.5px;">Buchungsbestätigung</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #4A154B; font-size: 28px; letter-spacing: -0.5px;">Vielen Dank für Ihre Buchung!</h2>
            <p>Sehr geehrte(r) <%= customer_name %>,</p>
            <p>wir freuen uns sehr, Ihre Buchung bei JOK Cosmetics bestätigen zu können. Hier sind Ihre Termindetails:</p>
            
            <!-- Booking Details -->
            <div style="background-color: #f9f5ff; padding: 30px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #4A154B; box-shadow: 0 2px 12px rgba(74, 21, 75, 0.1);">
                <h2 style="color: #4A154B; margin-top: 0; font-size: 24px; letter-spacing: -0.5px;">Ihre Buchungsdetails</h2>
                <p><strong>Service:</strong> <%= service_name %></p>
                <p><strong>Datum:</strong> <%= booking_date %></p>
                <p><strong>Uhrzeit:</strong> <%= booking_time %></p>
                <p><strong>Dauer:</strong> <%= duration %> Minuten</p>
                <p><strong>Preis:</strong> <%= price %> €</p>
            </div>

            <!-- Important Info -->
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(74, 21, 75, 0.1);">
                <h3 style="color: #4A154B; margin-top: 0; font-size: 20px; letter-spacing: -0.5px;">Wichtige Informationen</h3>
                <ul style="padding-left: 20px; margin: 15px 0;">
                    <li style="margin-bottom: 12px;">Bitte erscheinen Sie 5-10 Minuten vor Ihrem Termin</li>
                    <li style="margin-bottom: 12px;">Bei Verhinderung bitten wir Sie um eine Absage mindestens 24 Stunden vor dem Termin</li>
                    <li style="margin-bottom: 12px;">Bei Verspätungen kann sich die Behandlungszeit entsprechend verkürzen</li>
                    <li style="margin-bottom: 12px;">Bitte erscheinen Sie ungeschminkt zur Behandlung</li>
                </ul>
            </div>

            <!-- Location -->
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(74, 21, 75, 0.1);">
                <h3 style="color: #4A154B; margin-top: 0; font-size: 20px; letter-spacing: -0.5px;">Unser Standort</h3>
                <p>
                    <strong>JOK Cosmetics</strong><br>
                    Wilhelmstraße 17<br>
                    75378 Bad Liebenzell<br>
                    <br>
                    <a href="https://maps.google.com/?q=JOK+Cosmetics+Bad+Liebenzell" style="color: #4A154B;">
                        → In Google Maps öffnen
                    </a>
                </p>
            </div>

            <!-- Button -->
            <div style="text-align: center;">
                <a href="https://jok-cosmetics.de/booking/manage" style="display: inline-block; padding: 16px 36px; background-color: #4A154B; background-image: linear-gradient(135deg, #4A154B, #D4AF37); color: white; text-decoration: none; border-radius: 30px; margin: 25px 0; font-weight: bold; text-align: center; box-shadow: 0 4px 12px rgba(74, 21, 75, 0.2);">
                    Termin verwalten
                </a>
            </div>

            <!-- Calendar QR -->
            <div style="text-align: center; margin: 35px 0; padding: 20px; background-color: #f9f5ff; border-radius: 12px;">
                <p><strong>Termin zum Kalender hinzufügen</strong></p>
                <img src="<%= calendar_qr_code %>" alt="QR-Code für Kalender" style="max-width: 150px; height: auto; margin: 15px 0;">
            </div>

            <!-- Divider -->
            <div style="height: 2px; background: linear-gradient(to right, transparent, #D4AF37, transparent); margin: 35px 0; opacity: 0.5;"></div>

            <!-- Social Links -->
            <div style="text-align: center;">
                <p>Folgen Sie uns auf Social Media für Updates und Beauty-Tipps:</p>
                <div style="margin: 25px 0;">
                    <a href="https://instagram.com/jok.cosmetics" style="display: inline-block; margin: 0 12px; color: #4A154B; text-decoration: none; font-weight: 600;">Instagram</a> |
                    <a href="https://facebook.com/jokcosmetics" style="display: inline-block; margin: 0 12px; color: #4A154B; text-decoration: none; font-weight: 600;">Facebook</a> |
                    <a href="https://tiktok.com/@jokcosmetics" style="display: inline-block; margin: 0 12px; color: #4A154B; text-decoration: none; font-weight: 600;">TikTok</a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 40px 30px; background-color: #f9f5ff; color: #333333;">
            <div style="margin: 25px 0; line-height: 1.8;">
                <strong>JOK Cosmetics</strong><br>
                Tel: +49 173 5390 9280<br>
                Email: info@jok-cosmetics.de<br>
                Web: <a href="https://jok-cosmetics.de" style="color: #4A154B;">www.jok-cosmetics.de</a>
            </div>
            <p><small>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</small></p>
        </div>
    </div>
</body>
</html>`,
  'studio-email.html': `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neue Buchung eingegangen</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4; -webkit-font-smoothing: antialiased;">
    <div style="max-width: 600px; margin: 20px auto; padding: 0; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; padding: 40px 0; background-color: #4A154B; background-image: linear-gradient(135deg, #4A154B, #D4AF37);">
            <img src="https://jok-cosmetics.de/images/logo/jok-logo.png" alt="JOK Cosmetics Logo" style="max-width: 180px; height: auto; margin-bottom: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
            <h1 style="color: white; margin: 0; font-size: 32px; letter-spacing: -0.5px;">Neue Buchung eingegangen</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <!-- Booking Details -->
            <div style="background-color: #f9f5ff; padding: 30px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #4A154B; box-shadow: 0 2px 12px rgba(74, 21, 75, 0.1);">
                <h2 style="color: #4A154B; margin-top: 0; font-size: 24px; letter-spacing: -0.5px;">Buchungsdetails</h2>
                <p><strong>Service:</strong> <%= service_name %></p>
                <p><strong>Datum:</strong> <%= booking_date %></p>
                <p><strong>Uhrzeit:</strong> <%= booking_time %></p>
                <p><strong>Dauer:</strong> <%= duration %> Minuten</p>
                <p><strong>Preis:</strong> <%= price %> €</p>
            </div>

            <!-- Customer Info -->
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(74, 21, 75, 0.1);">
                <h3 style="color: #4A154B; margin-top: 0; font-size: 20px; letter-spacing: -0.5px;">Kundendetails</h3>
                <p><strong>Name:</strong> <%= customer_name %></p>
                <p><strong>E-Mail:</strong> <%= customer_email %></p>
                <p><strong>Telefon:</strong> <%= customer_phone %></p>
                <p><strong>Anmerkungen:</strong> <%= notes %></p>
            </div>

            <!-- Button -->
            <div style="text-align: center;">
                <a href="https://jok-cosmetics.de/admin/bookings" style="display: inline-block; padding: 16px 36px; background-color: #4A154B; background-image: linear-gradient(135deg, #4A154B, #D4AF37); color: white; text-decoration: none; border-radius: 30px; margin: 25px 0; font-weight: bold; text-align: center; box-shadow: 0 4px 12px rgba(74, 21, 75, 0.2);">
                    Buchung verwalten
                </a>
            </div>

            <!-- Divider -->
            <div style="height: 2px; background: linear-gradient(to right, transparent, #D4AF37, transparent); margin: 35px 0; opacity: 0.5;"></div>

            <!-- Info -->
            <div style="text-align: center;">
                <p style="margin: 0;">
                    Sie können die Buchung im Admin-Bereich bestätigen oder ablehnen.<br>
                    Der Kunde wird automatisch über Ihre Entscheidung informiert.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 30px; background-color: #f9f5ff; color: #333333;">
            <p style="margin: 0;"><small>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</small></p>
        </div>
    </div>
</body>
</html>`
};

async function renderTemplate(templateName: string, data: Record<string, string>): Promise<string> {
  const template = templates[templateName];
  if (!template) {
    throw new Error(`Template ${templateName} not found`);
  }
  return render(template, data) as string;
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Hole die neuesten Benachrichtigungen
    const { data: notifications, error: notificationError } = await supabaseClient
      .from('notification_queue')
      .select(`
        id,
        booking_id,
        notification_type,
        status,
        attempts,
        bookings (
          id,
          customer_id,
          service_id,
          requested_date,
          notes,
          cancellation_reason,
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
        )
      `)
      .eq('status', 'pending')
      .eq('notification_type', 'email')
      .lt('attempts', 3)
      .order('created_at', { ascending: true })
      .limit(10);

    if (notificationError) throw notificationError;
    if (!notifications || notifications.length === 0) {
      return new Response(JSON.stringify({ message: 'Keine ausstehenden Benachrichtigungen' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const client = new SmtpClient();

    try {
      const secure = Deno.env.get('SMTP_SECURE') === 'true';
      const config = {
        hostname: SMTP_HOST,
        port: SMTP_PORT,
        username: SMTP_USERNAME,
        password: SMTP_PASSWORD,
      };

      console.log('SMTP Konfiguration:', {
        ...config,
        secure,
        password: '********'
      });

      if (secure) {
        await client.connect({
          ...config,
          secure: true,
        });
      } else {
        await client.connectTLS(config);
      }

      // Test-E-Mail senden
      await client.send({
        from: SMTP_USERNAME,
        to: SMTP_USERNAME,
        subject: "SMTP Test",
        content: "text/plain",
        html: "Testing SMTP connection"
      });

      console.log('SMTP Verbindung und Authentifizierung erfolgreich');
    } catch (error) {
      console.error('SMTP Fehler:', error);
      throw error;
    }

    for (const notification of notifications) {
      const booking = notification.bookings;
      const customer = booking.customers;
      const service = booking.services;

      const customerName = `${customer.first_name} ${customer.last_name}`;
      const bookingDateTime = new Date(booking.requested_date);
      const bookingDate = bookingDateTime.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const bookingTime = bookingDateTime.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
      });
      const bookingNotes = booking.notes || 'Keine';

      try {
        let studioEmailContent: string;
        let customerEmailContent: string;
        let studioSubject: string;
        let customerSubject: string;

        // Wähle das passende Template basierend auf dem Benachrichtigungstyp
        if (notification.status === 'cancelled') {
          // Stornierungsbenachrichtigungen
          studioEmailContent = await renderTemplate('cancellation-studio.html', {
            customer_name: customerName,
            customer_email: customer.email,
            customer_phone: customer.phone,
            service_name: service.name,
            booking_date: bookingDate,
            service_duration: String(service.duration),
            service_price: String(service.price),
            cancellation_reason: booking.cancellation_reason || 'Kein Grund angegeben'
          });

          customerEmailContent = await renderTemplate('cancellation-customer.html', {
            service_name: service.name,
            booking_date: bookingDate
          });

          studioSubject = `Stornierung: ${service.name}`;
          customerSubject = 'Stornierungsbestätigung - JOK Cosmetics';
        } else {
          // Normale Buchungsbestätigungen
          studioEmailContent = await renderTemplate('studio-email.html', {
            customer_name: customerName,
            customer_email: customer.email,
            customer_phone: customer.phone,
            service_name: service.name,
            booking_date: bookingDate,
            booking_time: bookingTime,
            duration: String(service.duration),
            price: String(service.price),
            notes: bookingNotes,
          });

          customerEmailContent = await renderTemplate('customer-email.html', {
            customer_name: customerName,
            service_name: service.name,
            booking_date: bookingDate,
            booking_time: bookingTime,
            duration: String(service.duration),
            price: String(service.price),
            calendar_qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
              `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${service.name} bei JOK Cosmetics\nDTSTART:${bookingDateTime.toISOString()}\nDURATION:PT${service.duration}M\nLOCATION:Wilhelmstraße 17, 75378 Bad Liebenzell\nEND:VEVENT\nEND:VCALENDAR`
            )}`,
          });

          studioSubject = `Neue Buchung: ${service.name}`;
          customerSubject = 'Ihre Buchung bei JOK Cosmetics';
        }

        // E-Mail an das Studio
        await client.send({
          from: SMTP_USERNAME,
          to: STUDIO_EMAIL,
          subject: studioSubject,
          content: "text/html",
          html: studioEmailContent,
          headers: {
            "Content-Type": "text/html; charset=UTF-8",
            "MIME-Version": "1.0",
            "X-Mailer": "JOK Cosmetics Booking System"
          }
        });

        // E-Mail an den Kunden
        await client.send({
          from: SMTP_USERNAME,
          to: customer.email,
          subject: customerSubject,
          content: "text/html",
          html: customerEmailContent,
          headers: {
            "Content-Type": "text/html; charset=UTF-8",
            "MIME-Version": "1.0",
            "X-Mailer": "JOK Cosmetics Booking System"
          }
        });

        // Aktualisiere den Status der Benachrichtigung
        await supabaseClient
          .from('notification_queue')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', notification.id);
      } catch (error: unknown) {
        console.error('Fehler beim Senden der E-Mail:', error);

        // Aktualisiere die Anzahl der Versuche
        await supabaseClient
          .from('notification_queue')
          .update({
            attempts: notification.attempts + 1,
            last_error: error instanceof Error ? error.message : String(error),
          })
          .eq('id', notification.id);
      }
    }

    await client.close();

    return new Response(JSON.stringify({ message: 'E-Mails wurden verarbeitet' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: unknown) {
    console.error('Fehler:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : String(error) 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
