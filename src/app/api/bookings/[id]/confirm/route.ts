import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const supabase = await createClient();

  if (!context.params.id) {
    return NextResponse.json(
      { error: 'Buchungs-ID fehlt' },
      { status: 400 }
    );
  }

  try {
    // Überprüfe Admin-Berechtigung
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    // Hole die Buchung
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', context.params.id)
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
      .update({ status: 'confirmed' })
      .eq('id', context.params.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Fehler beim Bestätigen der Buchung' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error confirming booking:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}
