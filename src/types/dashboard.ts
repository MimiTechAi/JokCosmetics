export interface DashboardStats {
  todayBookings: number;
  weekBookings: number;
  monthlyRevenue: number;
  revenueChange: number;
  bookingsTrend: number;
}

export interface Booking {
  id: string;
  customer_id: string;
  service_id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
  customer?: {
    name: string;
    email: string;
  };
  service?: {
    name: string;
    price: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DashboardState {
  isLoading: boolean;
  stats: DashboardStats;
  recentBookings: Booking[];
  chatMessages: ChatMessage[];
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => Promise<void>;
  variant: 'primary' | 'secondary' | 'danger';
}
