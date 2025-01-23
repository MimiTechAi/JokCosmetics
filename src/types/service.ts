export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string | number;
  price: string | number;
  category: string;
  image: string;
  image_url?: string;
  is_active?: boolean;
  benefits?: string[];
  features?: {
    icon: string;
    text: string;
  }[];
  techniques?: string[];
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
