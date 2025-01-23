import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { bookingId, cancellationReason } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Überprüfe, ob die Buchung existiert
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Buchung nicht gefunden' },
        { status: 404 }
      );
    }

    // Aktualisiere den Status der Buchung
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: cancellationReason,
        cancelled_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Fehler beim Stornieren der Buchung' },
        { status: 500 }
      );
    }

    // Erstelle eine Benachrichtigung für das Studio
    await supabase.from('notification_queue').insert({
      booking_id: bookingId,
      notification_type: 'email',
      recipient_type: 'studio',
      subject: 'Buchung storniert',
      content: `Die Buchung #${bookingId} wurde storniert.\nGrund: ${cancellationReason}`,
      status: 'pending'
    });

    // Erstelle eine Benachrichtigung für den Kunden
    await supabase.from('notification_queue').insert({
      booking_id: bookingId,
      notification_type: 'email',
      recipient_type: 'customer',
      subject: 'Buchung storniert',
      content: 'Ihre Buchung wurde erfolgreich storniert.',
      status: 'pending'
    });

    return NextResponse.json(
      { message: 'Buchung erfolgreich storniert' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fehler beim Stornieren:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}
