export type ContactPreference = 'email' | 'phone' | 'whatsapp';

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  preferred_contact: ContactPreference;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerWithBookings extends Customer {
  bookings: {
    id: string;
    service_name: string;
    booking_date: Date;
    booking_time: string;
    status: string;
  }[];
}
