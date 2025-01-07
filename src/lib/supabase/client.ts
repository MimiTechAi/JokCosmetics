import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Service = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image_url: string;
};

export type Booking = {
  id: string;
  customer_id: string;
  service_id: string;
  requested_date: string;
  alternate_date?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
};

export type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  preferred_contact: 'email' | 'whatsapp';
};

export async function createBooking(
  serviceId: string,
  requestedDate: Date,
  customerData: Omit<Customer, 'id'>
): Promise<{ success: boolean; error?: string; booking?: Booking }> {
  try {
    // 1. Erstelle oder aktualisiere Kunde
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert([customerData], { onConflict: 'email' })
      .select()
      .single();

    if (customerError) throw customerError;

    // 2. Erstelle Buchung
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          customer_id: customer.id,
          service_id: serviceId,
          requested_date: requestedDate.toISOString(),
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (bookingError) throw bookingError;

    return { success: true, booking };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAvailableTimeSlots(
  serviceId: string,
  date: Date
): Promise<string[]> {
  // Geschäftszeiten: 9:00 - 18:00 Uhr
  const businessHours = {
    start: 9,
    end: 18
  };

  // Hole Service-Dauer
  const { data: service } = await supabase
    .from('services')
    .select('duration')
    .eq('id', serviceId)
    .single();

  if (!service) return [];

  // Hole existierende Buchungen für den Tag
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data: existingBookings } = await supabase
    .from('bookings')
    .select('requested_date, services(duration)')
    .gte('requested_date', startOfDay.toISOString())
    .lte('requested_date', endOfDay.toISOString())
    .not('status', 'eq', 'cancelled');

  // Generiere verfügbare Zeitslots
  const slots: string[] = [];
  const duration = service.duration;
  const slotInterval = duration; // in Minuten

  for (let hour = businessHours.start; hour < businessHours.end; hour++) {
    for (let minute = 0; minute < 60; minute += slotInterval) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, minute, 0, 0);

      // Prüfe ob der Slot verfügbar ist
      const isAvailable = !existingBookings?.some(booking => {
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

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  
  return data || [];
}
