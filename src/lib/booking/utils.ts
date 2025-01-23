import { TimeSlot } from '@/types/types'
import { supabase } from '@/lib/supabase/client'
import { addMinutes, format, isAfter, isBefore, setHours, setMinutes } from 'date-fns'

const BUSINESS_HOURS = {
  start: { hour: 10, minute: 0 },
  end: { hour: 18, minute: 0 },
  interval: 30, // Minuten
}

export async function getAvailableTimeSlots(date: Date, serviceId: string): Promise<TimeSlot[]> {
  const slots: TimeSlot[] = []
  const startTime = setMinutes(setHours(date, BUSINESS_HOURS.start.hour), BUSINESS_HOURS.start.minute)
  const endTime = setMinutes(setHours(date, BUSINESS_HOURS.end.hour), BUSINESS_HOURS.end.minute)
  let currentTime = startTime

  // Service-Dauer abrufen
  const { data: service } = await supabase
    .from('services')
    .select('duration')
    .eq('id', serviceId)
    .single()

  if (!service) {
    throw new Error('Service nicht gefunden')
  }

  // Bestehende Buchungen für den Tag abrufen
  const { data: bookings } = await supabase
    .from('bookings')
    .select('start_time, end_time')
    .eq('service_id', serviceId)
    .gte('start_time', date.toISOString())
    .lte('start_time', endTime.toISOString())
    .neq('status', 'cancelled')

  // Zeitslots generieren
  while (isBefore(currentTime, endTime)) {
    const slotEndTime = addMinutes(currentTime, service.duration)
    
    // Prüfen, ob der Slot in der Vergangenheit liegt
    const isPast = isBefore(currentTime, new Date())
    
    // Prüfen, ob der Slot mit bestehenden Buchungen kollidiert
    const isOverlapping = bookings?.some(booking => {
      const bookingStart = new Date(booking.start_time)
      const bookingEnd = new Date(booking.end_time)
      return (
        (isAfter(currentTime, bookingStart) && isBefore(currentTime, bookingEnd)) ||
        (isAfter(slotEndTime, bookingStart) && isBefore(slotEndTime, bookingEnd)) ||
        (isBefore(currentTime, bookingStart) && isAfter(slotEndTime, bookingEnd))
      )
    })

    slots.push({
      start: format(currentTime, 'HH:mm'),
      end: format(slotEndTime, 'HH:mm'),
      available: !isPast && !isOverlapping
    })

    currentTime = addMinutes(currentTime, BUSINESS_HOURS.interval)
  }

  return slots
}
