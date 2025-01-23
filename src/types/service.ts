export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceWithBookings extends Service {
  bookings: {
    id: string;
    booking_date: string;
    booking_time: string;
    status: string;
  }[];
}

export interface BookingWithService {
  service_id: string;
  services: Service;
}

export interface MonthlyBooking {
  service_id: string;
  services: {
    price: number;
  };
}
