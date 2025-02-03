import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!date || !serviceId) {
      return NextResponse.json(
        { error: 'Datum und Service-ID sind erforderlich' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Hole die Service-Dauer
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('duration')
      .eq('id', serviceId)
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { error: 'Service nicht gefunden' },
        { status: 404 }
      );
    }

    // Hole alle Buchungen für diesen Tag
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('time')
      .eq('date', date)
      .eq('service_id', serviceId)
      .eq('status', 'confirmed');

    if (bookingsError) {
      return NextResponse.json(
        { error: 'Fehler beim Laden der Buchungen' },
        { status: 500 }
      );
    }

    // Generiere verfügbare Zeitslots
    const workingHours = {
      start: 9, // 9:00
      end: 18, // 18:00
    };

    const bookedTimes = bookings?.map(b => b.time) || [];
    const availableTimes = [];

    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Prüfe ob dieser Zeitslot bereits gebucht ist
        if (!bookedTimes.includes(time)) {
          availableTimes.push(time);
        }
      }
    }

    return NextResponse.json(availableTimes);
  } catch (error) {
    console.error('Error in availability route:', error);
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
