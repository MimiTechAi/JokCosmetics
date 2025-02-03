export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: string;
  image_url: string;
  is_active: boolean;
}

export interface ServiceWithBookings extends Service {
  bookings: {
    id: string;
    date: string;
    status: string;
  }[];
}

export interface BookingWithService {
  service_id: string;
  service: Service;
}

export interface MonthlyBooking {
  service_id: string;
  services: {
    price: number;
  };
  price: number;
}
