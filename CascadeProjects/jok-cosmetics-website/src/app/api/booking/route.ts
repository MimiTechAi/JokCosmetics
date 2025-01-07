import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { service_id, date, customer } = body;

    // 1. Kunde erstellen/aktualisieren
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .upsert([customer], { onConflict: 'email' })
      .select()
      .single();

    if (customerError) throw customerError;

    // 2. Buchung erstellen
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          customer_id: customerData.id,
          service_id,
          requested_date: date,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (bookingError) throw bookingError;

    return NextResponse.json({
      success: true,
      booking: bookingData
    });

  } catch (error: any) {
    console.error('Buchungsfehler:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const service_id = searchParams.get('service_id');

    if (!date || !service_id) {
      throw new Error('Datum und Service-ID sind erforderlich');
    }

    // Verfügbare Zeitslots abrufen
    const { data: serviceData } = await supabase
      .from('services')
      .select('duration')
      .eq('id', service_id)
      .single();

    if (!serviceData) {
      throw new Error('Service nicht gefunden');
    }

    // Existierende Buchungen für den Tag abrufen
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('requested_date, services(duration)')
      .gte('requested_date', startOfDay.toISOString())
      .lte('requested_date', endOfDay.toISOString())
      .not('status', 'eq', 'cancelled');

    if (bookingsError) throw bookingsError;

    // Verfügbare Zeitslots berechnen
    const availableSlots = calculateAvailableSlots(
      date,
      serviceData.duration,
      bookings || []
    );

    return NextResponse.json({ success: true, slots: availableSlots });

  } catch (error: any) {
    console.error('Fehler beim Abrufen der Verfügbarkeit:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

function calculateAvailableSlots(
  date: string,
  duration: number,
  existingBookings: any[]
): string[] {
  const businessHours = {
    start: 9,
    end: 18
  };

  const slots: string[] = [];
  const slotInterval = duration; // in Minuten

  for (let hour = businessHours.start; hour < businessHours.end; hour++) {
    for (let minute = 0; minute < 60; minute += slotInterval) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, minute, 0, 0);

      const isAvailable = !existingBookings.some(booking => {
        const bookingTime = new Date(booking.requested_date);
        const bookingEnd = new Date(bookingTime.getTime() + booking.services.duration * 60000);
        const slotEnd = new Date(slotTime.getTime() + duration * 60000);

        return (
          (slotTime >= bookingTime && slotTime < bookingEnd) ||
          (slotEnd > bookingTime && slotEnd <= bookingEnd)
        );
      });

      if (isAvailable) {
        slots.push(slotTime.toISOString());
      }
    }
  }

  return slots;
}
