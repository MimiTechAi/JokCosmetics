import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';

// Definiere die möglichen Aktionen des Agenten
export type AgentAction = {
  type: string;
  params: Record<string, any>;
};

interface Booking {
  booking_date: string;
  booking_time: string;
  status: string;
  services?: {
    duration?: number;
    price?: number;
    title?: string;
  };
}

interface ServiceBooking {
  service_id: string;
  services: {
    name: string;
  } | null;
}

interface SupabaseBooking {
  service_id: string;
  services: {
    name: string;
  } | null;
}

type SupabaseResponse = {
  service_id: string;
  services: {
    name: string;
  } | null;
}[];

// Aktionen für Buchungsverwaltung
export async function handleBookingActions(action: AgentAction) {
  const supabase = createClientComponentClient();
  
  switch (action.type) {
    case 'CHECK_AVAILABILITY':
      return await checkAvailabilityRange(supabase, action.params.timeframe, action.params.service);

    case 'CREATE_BOOKING':
      const { customer_id, service_id, booking_date, booking_time } = action.params;
      const { data: newBooking } = await supabase
        .from('bookings')
        .insert({
          customer_id,
          service_id,
          booking_date,
          booking_time,
          status: 'confirmed'
        })
        .select()
        .single();
      return newBooking;

    case 'CANCEL_BOOKING':
      const { booking_id } = action.params;
      await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking_id);
      return { success: true };
  }
}

// Prüft Verfügbarkeit über einen Zeitraum für den AI-Agenten
async function checkAvailabilityRange(
  supabase: any,
  timeframe: { start: string; end: string },
  service: string
) {
  try {
    // Hole existierende Buchungen für den Zeitraum
    const { data: existingBookings, error } = await supabase
      .from('bookings')
      .select('booking_date, booking_time')
      .gte('booking_date', timeframe.start)
      .lte('booking_date', timeframe.end);

    if (error) throw error;

    // Verfügbare Zeitfenster berechnen
    const availableSlots = [];
    const startDate = new Date(timeframe.start);
    const endDate = new Date(timeframe.end);

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayBookings = existingBookings.filter(
        (booking: Booking) => booking.booking_date === dateStr
      );

      // Geschäftszeiten: 9:00 - 18:00 Uhr
      const businessHours = {
        start: 9,
        end: 18
      };

      // Prüfe jede volle Stunde
      for (let hour = businessHours.start; hour < businessHours.end; hour++) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        const isBooked = dayBookings.some(
          (booking: Booking) => booking.booking_time === timeStr
        );

        if (!isBooked) {
          availableSlots.push({
            date: dateStr,
            time: timeStr
          });
        }
      }
    }

    return {
      success: true,
      availableSlots,
      message: `Ich habe ${availableSlots.length} verfügbare Termine gefunden.`
    };
  } catch (error) {
    console.error('Error checking availability:', error);
    return {
      success: false,
      message: 'Entschuldigung, bei der Terminprüfung ist ein Fehler aufgetreten.'
    };
  }
}

// Aktionen für Kundenverwaltung
export async function handleCustomerActions(action: AgentAction) {
  const supabase = createClientComponentClient();

  switch (action.type) {
    case 'GET_CUSTOMER_INFO':
      const { customer_id } = action.params;
      const { data: customer } = await supabase
        .from('customers')
        .select('*, bookings(*)')
        .eq('id', customer_id)
        .single();
      return customer;

    case 'UPDATE_CUSTOMER_PREFERENCES':
      const { id, preferences } = action.params;
      const { data: updatedCustomer } = await supabase
        .from('customers')
        .update({ preferences })
        .eq('id', id)
        .select()
        .single();
      return updatedCustomer;
  }
}

// Aktionen für Serviceverwaltung
export async function handleServiceActions(action: AgentAction) {
  const supabase = createClientComponentClient();

  switch (action.type) {
    case 'GET_SERVICE_DETAILS':
      const { service_id } = action.params;
      const { data: service } = await supabase
        .from('services')
        .select('*')
        .eq('id', service_id)
        .single();
      return service;

    case 'CHECK_SERVICE_AVAILABILITY':
      const { service_ids, date } = action.params;
      const { data: bookings } = await supabase
        .from('bookings')
        .select('service_id')
        .eq('booking_date', date)
        .in('service_id', service_ids);
      
      const availability = service_ids.reduce((acc: Record<string, number>, id: string) => {
        const serviceBookings = bookings?.filter(b => b.service_id === id) || [];
        acc[id] = 8 - serviceBookings.length; // Maximale Slots pro Tag
        return acc;
      }, {});
      
      return availability;
  }
}

// Aktionen für Analysen und Berichte
export async function handleAnalyticsActions(action: AgentAction) {
  const supabase = createClientComponentClient();

  switch (action.type) {
    case 'GET_DAILY_STATS':
      const { date } = action.params;
      const { data: dailyBookings } = await supabase
        .from('bookings')
        .select('*, services(*)')
        .eq('booking_date', date);

      const dailyStats = {
        total_bookings: dailyBookings?.length ?? 0,
        revenue: dailyBookings?.reduce((sum: number, booking: Booking) => 
          sum + (booking.services?.price || 0), 0) ?? 0,
        status_breakdown: dailyBookings?.reduce((acc: Record<string, number>, booking: Booking) => {
          acc[booking.status] = (acc[booking.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      return dailyStats;

    case 'GET_WEEKLY_STATS':
      const { timeframe } = action.params;
      const { data: weeklyBookings } = await supabase
        .from('bookings')
        .select('*, services(*)')
        .gte('booking_date', timeframe.start)
        .lte('booking_date', timeframe.end);

      const revenue = weeklyBookings?.reduce((sum: number, booking: Booking) => 
        sum + (booking.services?.price || 0), 0) ?? 0;
      const total_bookings = weeklyBookings?.length ?? 0;

      const serviceCount = weeklyBookings?.reduce((acc: Record<string, number>, booking: Booking) => {
        const serviceName = booking.services?.title || 'Unbekannt';
        acc[serviceName] = (acc[serviceName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const popular_services = Object.entries(serviceCount || {})
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([name]) => name);

      return {
        timeframe,
        revenue,
        total_bookings,
        popular_services
      };

    case 'GET_POPULAR_SERVICES':
      const { data: services } = await supabase
        .from('bookings')
        .select('service_id, services(name)')
        .gte('booking_date', action.params.timeframe.start)
        .lte('booking_date', action.params.timeframe.end);

      if (!services) return { service_counts: {}, top_services: [] };

      const typedServices = services as unknown as SupabaseResponse;
      const serviceCounts = typedServices.reduce((acc: Record<string, number>, booking) => {
        const serviceName = booking.services?.name || booking.service_id;
        acc[serviceName] = (acc[serviceName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        service_counts: serviceCounts,
        top_services: Object.entries(serviceCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }))
      };
  }
}

export async function getServices(category?: string) {
  const supabase = createClientComponentClient();
  
  let query = supabase
    .from('services')
    .select('*')
    .eq('active', true);

  if (category) {
    query = query.eq('category', category);
  }

  const { data: services, error } = await query;

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return services;
}

export async function checkAvailability(date: string, serviceId?: string) {
  const supabase = createClientComponentClient();
  
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, services(duration)')
    .eq('booking_date', date)
    .not('status', 'eq', 'cancelled');

  const { data: businessHours } = await supabase
    .from('business_hours')
    .select('*')
    .single();

  let service;
  if (serviceId) {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();
    service = data;
  }

  const openingTime = new Date(`${date}T${businessHours?.open_time || '09:00'}:00`);
  const closingTime = new Date(`${date}T${businessHours?.close_time || '18:00'}:00`);
  const serviceDuration = service?.duration || 60;

  const bookedSlots = bookings?.map(booking => ({
    start: new Date(`${date}T${booking.booking_time}`),
    end: new Date(`${date}T${booking.booking_time}`).setMinutes(
      new Date(`${date}T${booking.booking_time}`).getMinutes() + (booking.services?.duration || 60)
    )
  })) || [];

  let currentTime = openingTime;
  const availableSlots = [];

  while (currentTime < closingTime) {
    const slotEnd = new Date(currentTime.getTime() + serviceDuration * 60000);
    
    const isConflict = bookedSlots.some(slot => 
      (currentTime >= new Date(slot.start) && currentTime < new Date(slot.end)) ||
      (slotEnd > new Date(slot.start) && slotEnd <= new Date(slot.end))
    );

    if (!isConflict && slotEnd <= closingTime) {
      availableSlots.push(currentTime.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit'
      }));
    }

    currentTime = new Date(currentTime.getTime() + 30 * 60000);
  }

  return {
    available: availableSlots.length > 0,
    slots: availableSlots.length,
    availableSlots,
    nextAvailable: availableSlots[0] || null
  };
}
