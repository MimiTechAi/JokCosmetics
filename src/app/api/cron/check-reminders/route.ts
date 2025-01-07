import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { NotificationService } from '@/lib/notifications/NotificationService';

export async function GET() {
  try {
    // Hole alle Termine für morgen
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('requested_date', tomorrow.toISOString())
      .lte('requested_date', tomorrowEnd.toISOString())
      .eq('status', 'confirmed');

    if (error) throw error;

    // Sende Erinnerungen für jeden Termin
    for (const booking of bookings) {
      await NotificationService.sendNotification('BOOKING_REMINDER', {
        bookingId: booking.id
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `${bookings.length} Erinnerungen gesendet` 
    });
  } catch (error) {
    console.error('Fehler beim Senden der Erinnerungen:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Fehler beim Senden der Erinnerungen' 
    }, { status: 500 });
  }
}
