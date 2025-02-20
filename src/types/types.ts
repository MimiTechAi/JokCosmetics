import { Database } from '@/lib/database.types'

export type Service = Database['public']['Tables']['services']['Row'] & {
  category_id: string | null;
}
export type ServiceInsert = Database['public']['Tables']['services']['Insert']
export type ServiceUpdate = Database['public']['Tables']['services']['Update']

export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export interface TimeSlot {
  start: string
  end: string
  available: boolean
}

export interface BookingFormData {
  serviceId: string
  date: Date
  time: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  notes?: string
  newsletter?: boolean
  reminders?: boolean
  termsAccepted: boolean
}
