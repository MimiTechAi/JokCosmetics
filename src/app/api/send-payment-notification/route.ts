import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/notifications/email';

export async function POST(req: Request) {
  try {
    const { bookingId, paymentCode, amount, customerEmail, paymentMethod } = await req.json();

    const subject = `Neue Zahlung ausstehend: Buchung #${bookingId}`;
    const html = `
      <h2>Neue Zahlungsanforderung</h2>
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Buchungs-ID:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${bookingId}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Zahlungs-Code:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${paymentCode}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Betrag:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${amount.toFixed(2)}€</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Kunde:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${customerEmail}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Zahlungsmethode:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${paymentMethod}</td>
        </tr>
      </table>
      <p>
        Bitte überprüfen Sie den Zahlungseingang und bestätigen Sie die Buchung
        im Dashboard, sobald die Zahlung eingegangen ist.
      </p>
      <p>
        <strong>Wichtig:</strong> Vergleichen Sie immer den Zahlungs-Code mit dem
        Verwendungszweck der eingegangenen Zahlung.
      </p>
    `;

    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@jok-cosmetics.de',
      subject,
      html
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Senden der Admin-Benachrichtigung:', error);
    return NextResponse.json(
      { error: 'Fehler beim Senden der Benachrichtigung' },
      { status: 500 }
    );
  }
}
