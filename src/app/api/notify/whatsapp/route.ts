import { NextResponse } from 'next/server';

function createWhatsAppLink(phone: string, message: string) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
}

export async function POST(request: Request) {
  try {
    const booking = await request.json();
    console.log('Starte WhatsApp-Benachrichtigung für:', booking);

    // WhatsApp-Nachricht für den Kunden
    const customerMessage = `Hallo ${booking.customerName}! 👋

Vielen Dank für Ihre Buchung bei JOK Cosmetics!

Ihr Termin:
📅 ${new Date(booking.dateTime).toLocaleDateString('de-DE')}
⏰ ${new Date(booking.dateTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
💅 ${booking.serviceName}

Wir freuen uns auf Sie! 🌟`;

    // WhatsApp-Nachricht für JOK Cosmetics
    const adminMessage = `Neue Buchung eingegangen!

👤 ${booking.customerName}
📅 ${new Date(booking.dateTime).toLocaleDateString('de-DE')}
⏰ ${new Date(booking.dateTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
💅 ${booking.serviceName}
${booking.notes ? `📝 ${booking.notes}` : ''}`;

    // Erstelle WhatsApp-Links
    const customerWhatsAppLink = createWhatsAppLink(booking.customerPhone, customerMessage);
    const adminWhatsAppLink = createWhatsAppLink('+491735390928', adminMessage);

    return NextResponse.json({
      success: true,
      customerLink: customerWhatsAppLink,
      adminLink: adminWhatsAppLink
    });

  } catch (error: any) {
    console.error('Fehler bei der WhatsApp-Benachrichtigung:', error);
    return NextResponse.json(
      { error: error.message || 'Fehler bei der WhatsApp-Benachrichtigung' },
      { status: 500 }
    );
  }
}
