import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type Customer = Database['public']['Tables']['customers']['Insert'];
type Booking = Database['public']['Tables']['bookings']['Insert'];
type Service = Database['public']['Tables']['services']['Row'];

export interface BookingData {
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
}

async function createEmailNotification(booking: any, customer: any, service: any) {
  const formattedDate = format(new Date(booking.start_time), 'dd. MMMM yyyy', { locale: de });
  const formattedTime = format(new Date(booking.start_time), 'HH:mm', { locale: de });

  const emailContent = `
Sehr geehrte(r) ${customer.first_name} ${customer.last_name},

vielen Dank für Ihre Buchung bei JOK Cosmetics!

Ihre Buchungsdetails:
- Behandlung: ${service.name}
- Datum: ${formattedDate}
- Uhrzeit: ${formattedTime}

Wir werden Ihre Buchung schnellstmöglich bestätigen. 
Bei Fragen können Sie uns jederzeit kontaktieren.

Mit freundlichen Grüßen
Ihr JOK Cosmetics Team
`;

  return await supabase
    .from('notification_queue')
    .insert({
      booking_id: booking.id,
      notification_type: 'email',
      recipient_email: customer.email,
      subject: 'Ihre Buchungsbestätigung - JOK Cosmetics',
      content: emailContent,
      status: 'pending'
    });
}

async function createWhatsAppNotification(booking: any, customer: any, service: any) {
  if (!customer.phone) return null;

  const formattedDate = format(new Date(booking.start_time), 'dd. MMMM yyyy', { locale: de });
  const formattedTime = format(new Date(booking.start_time), 'HH:mm', { locale: de });

  const whatsappContent = `
Hallo ${customer.first_name},
Danke für Ihre Buchung bei JOK Cosmetics!
Behandlung: ${service.name}
Datum: ${formattedDate}
Uhrzeit: ${formattedTime}
Wir bestätigen Ihre Buchung in Kürze.`;

  return await supabase
    .from('notification_queue')
    .insert({
      booking_id: booking.id,
      notification_type: 'whatsapp',
      recipient_phone: customer.phone,
      content: whatsappContent,
      status: 'pending'
    });
}

export async function createBooking(data: BookingData) {
  try {
    // 1. Erstelle oder aktualisiere den Kunden
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone || null
      })
      .select()
      .single();

    if (customerError) {
      console.error('Customer error:', customerError);
      throw new Error('Fehler beim Erstellen des Kundenprofils');
    }

    // 2. Hole Service-Details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', data.serviceId)
      .single();

    if (serviceError) {
      console.error('Service error:', serviceError);
      throw new Error('Service nicht gefunden');
    }

    // 3. Erstelle die Buchung
    const startTime = new Date(data.bookingDate);
    const [hours, minutes] = data.bookingTime.split(':');
    startTime.setHours(parseInt(hours), parseInt(minutes));

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + service.duration);

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_id: customer.id,
        service_id: data.serviceId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        notes: data.notes || null,
        status: 'pending'
      })
      .select(`
        id,
        start_time,
        end_time,
        status,
        notes,
        service_id,
        customer_id
      `)
      .single();

    if (bookingError) {
      console.error('Booking error:', bookingError);
      throw new Error('Fehler beim Erstellen der Buchung');
    }

    // 4. Erstelle Benachrichtigungen
    await createEmailNotification(booking, customer, service);
    if (customer.phone) {
      await createWhatsAppNotification(booking, customer, service);
    }

    return {
      ...booking,
      customer,
      service
    };
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
}

export async function getBookings(date: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      requested_date,
      status,
      notes,
      services (
        id,
        name,
        duration,
        price
      ),
      customers (
        first_name,
        last_name,
        email,
        phone
      )
    `)
    .eq('requested_date', date)
    .order('requested_date');

  if (error) {
    console.error('Fehler beim Laden der Buchungen:', error);
    throw new Error('Fehler beim Laden der Buchungen');
  }

  return data;
}
