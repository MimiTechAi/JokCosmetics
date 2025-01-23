export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  customer_id: string;
  service_id: string;
  booking_date: Date;
  booking_time: string;
  notes?: string;
  status: BookingStatus;
  created_at: Date;
  updated_at: Date;
}

export interface BookingWithDetails extends Booking {
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    whatsapp?: string;
  };
  service: {
    name: string;
    duration: number;
    price: number;
    category: string;
  };
}

export interface BookingOptimizationResult {
  suggestedBookings: {
    date: string;
    time: string;
    duration: number;
  }[];
  explanation: string;
}
