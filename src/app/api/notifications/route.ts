import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// E-Mail-Transporter konfigurieren
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      customerEmail, 
      customerName,
      serviceName,
      serviceDate,
      serviceTime,
      customerPhone,
      notes 
    } = body;

    // E-Mail an den Kunden
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: customerEmail,
      subject: 'Ihre Buchungsbestätigung - JOK Cosmetics',
      html: `
        <h1>Vielen Dank für Ihre Buchung!</h1>
        <p>Sehr geehrte(r) ${customerName},</p>
        <p>wir bestätigen hiermit Ihren Termin:</p>
        <ul>
          <li>Behandlung: ${serviceName}</li>
          <li>Datum: ${serviceDate}</li>
          <li>Uhrzeit: ${serviceTime}</li>
        </ul>
        <p>Wir freuen uns auf Ihren Besuch!</p>
        <p>Mit freundlichen Grüßen<br>Ihr JOK Cosmetics Team</p>
      `
    });

    // E-Mail an das Studio
    const whatsappLink = customerPhone ? 
      `https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}` : 
      'Keine Telefonnummer angegeben';

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'Neue Buchung eingegangen',
      html: `
        <h1>Neue Buchung</h1>
        <h2>Kundendetails:</h2>
        <ul>
          <li>Name: ${customerName}</li>
          <li>E-Mail: ${customerEmail}</li>
          <li>Telefon: ${customerPhone || 'Nicht angegeben'}</li>
        </ul>
        <h2>Termindetails:</h2>
        <ul>
          <li>Behandlung: ${serviceName}</li>
          <li>Datum: ${serviceDate}</li>
          <li>Uhrzeit: ${serviceTime}</li>
        </ul>
        ${notes ? `<h2>Anmerkungen:</h2><p>${notes}</p>` : ''}
        <p>WhatsApp Link zum Kunden: <a href="${whatsappLink}">${whatsappLink}</a></p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Senden der Benachrichtigungen' },
      { status: 500 }
    );
  }
}
