import { createTransport } from 'nodemailer';
import { NextResponse } from 'next/server';

// E-Mail-Transporter erstellen
const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Überprüfe die E-Mail-Konfiguration beim Start
console.log('E-Mail-Konfiguration:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD ? '***' : undefined
});

export async function POST(request: Request) {
  try {
    const booking = await request.json();
    console.log('Starte E-Mail-Versand für:', booking);

    // Überprüfe die Verbindung zum E-Mail-Server
    try {
      await transporter.verify();
      console.log('E-Mail-Server-Verbindung erfolgreich');
    } catch (verifyError) {
      console.error('E-Mail-Server-Verbindungsfehler:', verifyError);
      throw new Error('Keine Verbindung zum E-Mail-Server möglich');
    }

    // Admin-E-Mail
    const adminMailOptions = {
      from: process.env.EMAIL_FROM || 'JOK Cosmetics <thansuda22@googlemail.com>',
      to: process.env.EMAIL_USER || 'thansuda22@googlemail.com',
      subject: `✨ Neue Buchung von ${booking.customerName}`,
      text: `
🌟 Neue Buchung bei JOK Cosmetics 🌟

📅 Termin: ${new Date(booking.dateTime).toLocaleDateString('de-DE')}
⏰ Zeit: ${new Date(booking.dateTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
👤 Kunde: ${booking.customerName}
📱 Telefon: ${booking.customerPhone}
📧 E-Mail: ${booking.customerEmail}
💅 Service: ${booking.serviceName}
${booking.notes ? `📝 Anmerkungen: ${booking.notes}` : ''}

WhatsApp: https://wa.me/${booking.customerPhone.replace(/[^0-9]/g, '')}
`
    };

    console.log('Sende Admin-E-Mail mit Optionen:', {
      ...adminMailOptions,
      text: '*** Text ausgeblendet ***'
    });

    const adminInfo = await transporter.sendMail(adminMailOptions);
    console.log('Admin-E-Mail gesendet:', adminInfo);

    // Kunden-E-Mail
    const customerMailOptions = {
      from: process.env.EMAIL_FROM || 'JOK Cosmetics <thansuda22@googlemail.com>',
      to: booking.customerEmail,
      subject: '🌟 Ihre Buchung bei JOK Cosmetics',
      text: `
🌟 Ihre Buchung bei JOK Cosmetics 🌟

Vielen Dank für Ihre Buchung! 

📅 Ihr Termin: ${new Date(booking.dateTime).toLocaleDateString('de-DE')}
⏰ Uhrzeit: ${new Date(booking.dateTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
💅 Service: ${booking.serviceName}

Sie erhalten in Kürze eine Bestätigung von uns.

Bei Fragen erreichen Sie uns unter:
📱 Telefon: +49 173 5390928
💬 WhatsApp: https://wa.me/491735390928
📧 E-Mail: thansuda22@googlemail.com

Ihr JOK Cosmetics Team
`
    };

    console.log('Sende Kunden-E-Mail mit Optionen:', {
      ...customerMailOptions,
      text: '*** Text ausgeblendet ***'
    });

    const customerInfo = await transporter.sendMail(customerMailOptions);
    console.log('Kunden-E-Mail gesendet:', customerInfo);

    return NextResponse.json({ 
      success: true,
      adminMail: adminInfo.messageId,
      customerMail: customerInfo.messageId
    });

  } catch (error: any) {
    console.error('Fehler beim E-Mail-Versand:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Fehler beim E-Mail-Versand',
        details: error.stack
      },
      { status: 500 }
    );
  }
}
