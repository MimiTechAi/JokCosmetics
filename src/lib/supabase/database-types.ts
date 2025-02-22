import { BookingStatus } from '../../types/booking';

export type Database = {
  public: {
    Tables: Record<string, any>,
    Views: Record<string, any>,
    Functions: Record<string, any>,
    Enums: Record<string, any>
  }
}

export type Booking = {
  id: string;
  service_id: string;
  booking_date: string;
  booking_time: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes?: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
};
