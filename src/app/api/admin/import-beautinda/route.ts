import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BEAUTINDA_API_URL = 'https://beautinda.de/api';
const ARTIST_ID = 'uzd2qhj2Z7hNOPOwNUgpYitcEIF2';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // 1. Hole Daten von Beautinda
    const response = await fetch(`${BEAUTINDA_API_URL}/artist/${ARTIST_ID}/bookings`);
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Beautinda-Daten');
    }
    const beautindaData = await response.json();

    // 2. Transformiere und importiere Kunden
    for (const booking of beautindaData) {
      const { error: customerError } = await supabase
        .from('customers')
        .upsert({
          email: booking.customerEmail,
          first_name: booking.customerFirstName,
          last_name: booking.customerLastName,
          phone: booking.customerPhone,
        }, {
          onConflict: 'email'
        });

      if (customerError) {
        console.error('Fehler beim Importieren des Kunden:', customerError);
        continue;
      }

      // Hole die customer_id für die Buchung
      const { data: customerData } = await supabase
        .from('customers')
        .select('id')
        .eq('email', booking.customerEmail)
        .single();

      if (!customerData) {
        console.error('Kunde nicht gefunden:', booking.customerEmail);
        continue;
      }

      // 3. Transformiere und importiere Service (falls noch nicht vorhanden)
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('id')
        .eq('name', booking.serviceName)
        .single();

      let serviceId;
      if (!serviceData) {
        const { data: newService, error: newServiceError } = await supabase
          .from('services')
          .insert({
            name: booking.serviceName,
            duration: booking.serviceDuration,
            price: booking.servicePrice,
            description: booking.serviceDescription || '',
          })
          .select('id')
          .single();

        if (newServiceError) {
          console.error('Fehler beim Erstellen des Services:', newServiceError);
          continue;
        }
        serviceId = newService.id;
      } else {
        serviceId = serviceData.id;
      }

      // 4. Importiere die Buchung
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          customer_id: customerData.id,
          service_id: serviceId,
          booking_date: new Date(booking.date).toISOString().split('T')[0],
          booking_time: booking.time,
          status: booking.status,
          notes: booking.notes || '',
        });

      if (bookingError) {
        console.error('Fehler beim Importieren der Buchung:', bookingError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Daten erfolgreich importiert' 
    });

  } catch (error) {
    console.error('Import-Fehler:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Fehler beim Importieren der Daten',
          error: error.message // Safe to access message
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Fehler beim Importieren der Daten',
          error: 'Ein unbekannter Fehler ist aufgetreten.' // Fallback for unknown errors
        },
        { status: 500 }
      );
    }
  }
}
