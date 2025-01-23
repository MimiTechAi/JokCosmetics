import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/lib/database.types';
import { format, subMonths } from 'date-fns';

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getLastAppointment(customerId: string) {
  const { data } = await supabase
    .from('bookings')
    .select('requested_date')
    .eq('customer_id', customerId)
    .order('requested_date', { ascending: false })
    .limit(1);

  return data?.[0]?.requested_date
    ? format(new Date(data[0].requested_date), 'dd.MM.yyyy')
    : 'Keine Behandlungen';
}

export async function getPreferredServices(customerId: string) {
  const { data } = await supabase
    .from('bookings')
    .select('service_id')
    .eq('customer_id', customerId)
    .order('requested_date', { ascending: false });

  if (!data?.length) return 'Keine Präferenzen';

  const serviceCounts = data.reduce((acc: { [key: string]: number }, booking) => {
    acc[booking.service_id] = (acc[booking.service_id] || 0) + 1;
    return acc;
  }, {});

  const topServices = Object.entries(serviceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([serviceId]) => serviceId);

  const { data: services } = await supabase
    .from('services')
    .select('name')
    .in('id', topServices);

  return services?.map(s => s.name).join(', ') || 'Keine Präferenzen';
}

export async function getAverageRating(customerId: string) {
  const { data } = await supabase
    .from('bookings')
    .select('customer_rating')
    .eq('customer_id', customerId)
    .not('customer_rating', 'is', null);

  if (!data?.length) return 'Keine Bewertungen';

  const average = data.reduce((sum, booking) => sum + (booking.customer_rating || 0), 0) / data.length;
  return average.toFixed(1);
}

export async function getRecommendedProducts(serviceId: string) {
  const { data } = await supabase
    .from('services')
    .select('recommended_products')
    .eq('id', serviceId)
    .single();

  return data?.recommended_products || [];
}

export async function updateBookingNotes(bookingId: string, notes: string) {
  return supabase
    .from('bookings')
    .update({ notes })
    .eq('id', bookingId);
}

export async function analyzeCustomerBookingHistory(customerId: string) {
  const { data: bookings } = await supabase
    .from('bookings')
    .select('requested_date')
    .eq('customer_id', customerId)
    .order('requested_date', { ascending: false });

  if (!bookings?.length) return null;

  const timePreferences = bookings.reduce((acc: { [key: string]: number }, booking) => {
    const hour = new Date(booking.requested_date).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const preferredHours = Object.entries(timePreferences)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => parseInt(hour));

  return preferredHours;
}

export async function getCustomerMetrics(customerId: string) {
  const threeMonthsAgo = format(subMonths(new Date(), 3), 'yyyy-MM-dd');

  const { data: recentBookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', customerId)
    .gte('requested_date', threeMonthsAgo);

  const { data: allBookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', customerId);

  return {
    totalBookings: allBookings?.length || 0,
    recentBookings: recentBookings?.length || 0,
    averageRating: await getAverageRating(customerId),
    lastAppointment: await getLastAppointment(customerId),
    preferredServices: await getPreferredServices(customerId)
  };
}

export async function getAvailableTimeSlots(date: Date, duration: number) {
  const dayStart = new Date(date);
  dayStart.setHours(9, 0, 0, 0);
  
  const dayEnd = new Date(date);
  dayEnd.setHours(18, 0, 0, 0);

  const { data: existingBookings } = await supabase
    .from('bookings')
    .select('requested_date, services(duration)')
    .gte('requested_date', dayStart.toISOString())
    .lte('requested_date', dayEnd.toISOString());

  const bookedSlots = existingBookings?.map(booking => ({
    start: new Date(booking.requested_date),
    end: new Date(new Date(booking.requested_date).getTime() + 
      ((booking.services?.[0]?.duration || 0) + 15) * 60000) // 15 Minuten Puffer
  })) || [];

  const availableSlots = [];
  let currentTime = dayStart;

  while (currentTime < dayEnd) {
    const slotEnd = new Date(currentTime.getTime() + duration * 60000);
    
    const isAvailable = !bookedSlots.some(slot => 
      (currentTime >= slot.start && currentTime < slot.end) ||
      (slotEnd > slot.start && slotEnd <= slot.end)
    );

    if (isAvailable) {
      availableSlots.push(new Date(currentTime));
    }

    currentTime = new Date(currentTime.getTime() + 30 * 60000); // 30-Minuten-Intervalle
  }

  return availableSlots;
}

export function recommendBestTimeSlots(preferredHours: number[], availableSlots: Date[]) {
  return availableSlots
    .sort((a, b) => {
      const aScore = preferredHours.includes(a.getHours()) ? 1 : 0;
      const bScore = preferredHours.includes(b.getHours()) ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, 5);
}
