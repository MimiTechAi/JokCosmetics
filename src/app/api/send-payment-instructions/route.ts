import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/notifications/email';

export async function POST(req: Request) {
  try {
    const { email, instructions, bookingId, amount, paymentMethod } = await req.json();

    const subject = `Zahlungsinformationen für Ihre Buchung #${bookingId}`;
    const html = `
      <h2>Vielen Dank für Ihre Buchung bei JOK Cosmetics!</h2>
      <p>Hier sind Ihre Zahlungsinformationen:</p>
      <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
${instructions}
      </pre>
      <p>
        Sobald wir Ihre Zahlung erhalten haben, senden wir Ihnen eine Bestätigung.
        Bei Fragen können Sie uns jederzeit kontaktieren.
      </p>
      <p>
        Mit freundlichen Grüßen,<br>
        Ihr JOK Cosmetics Team
      </p>
    `;

    await sendEmail({
      to: email,
      subject,
      html
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    return NextResponse.json(
      { error: 'Fehler beim Senden der Zahlungsinformationen' },
      { status: 500 }
    );
  }
}
