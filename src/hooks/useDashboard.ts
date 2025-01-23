import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { DashboardStats, Booking, DashboardState } from '@/types/dashboard';
import { MonthlyBooking } from '@/types/service';

export const useDashboard = () => {
  const [state, setState] = useState<DashboardState>({
    isLoading: true,
    stats: {
      todayBookings: 0,
      weekBookings: 0,
      monthlyRevenue: 0,
      revenueChange: 0,
      bookingsTrend: 0
    },
    recentBookings: [],
    chatMessages: []
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const calculateRevenueChange = (currentRevenue: number, previousRevenue: number): number => {
    if (previousRevenue === 0) return 100;
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  };

  const calculateBookingsTrend = (currentBookings: number, previousBookings: number): number => {
    if (previousBookings === 0) return 100;
    return ((currentBookings - previousBookings) / previousBookings) * 100;
  };

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      // Fetch today's bookings
      const { count: todayCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .eq('booking_date', today);

      // Fetch this week's bookings
      const { count: weekCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .gte('booking_date', startOfWeek.toISOString().split('T')[0])
        .lte('booking_date', endOfWeek.toISOString().split('T')[0]);

      // Fetch monthly revenue data
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const { data: monthBookings } = await supabase
        .from('bookings')
        .select('service_id, services(price)')
        .gte('booking_date', startOfMonth.toISOString().split('T')[0])
        .not('services', 'is', null) as { data: MonthlyBooking[] | null };

      // Calculate monthly revenue
      const monthlyRevenue = monthBookings?.reduce((sum, booking) => {
        return sum + (booking.services?.price || 0);
      }, 0) || 0;

      // Fetch previous month's data for comparison
      const startOfPrevMonth = new Date(startOfMonth);
      startOfPrevMonth.setMonth(startOfPrevMonth.getMonth() - 1);
      const { data: prevMonthBookings } = await supabase
        .from('bookings')
        .select('service_id, services(price)')
        .gte('booking_date', startOfPrevMonth.toISOString().split('T')[0])
        .lt('booking_date', startOfMonth.toISOString().split('T')[0])
        .not('services', 'is', null) as { data: MonthlyBooking[] | null };

      const prevMonthlyRevenue = prevMonthBookings?.reduce((sum, booking) => {
        return sum + (booking.services?.price || 0);
      }, 0) || 0;

      // Fetch recent bookings with customer and service details
      const { data: recent } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customer_id(name, email),
          service:service_id(name, price)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Update dashboard state
      setState(prev => ({
        ...prev,
        isLoading: false,
        stats: {
          todayBookings: todayCount || 0,
          weekBookings: weekCount || 0,
          monthlyRevenue,
          revenueChange: calculateRevenueChange(monthlyRevenue, prevMonthlyRevenue),
          bookingsTrend: calculateBookingsTrend(weekCount || 0, prev.stats.weekBookings)
        },
        recentBookings: recent || []
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const addChatMessage = (message: string, role: 'user' | 'assistant') => {
    setState(prev => ({
      ...prev,
      chatMessages: [
        ...prev.chatMessages,
        {
          role,
          content: message,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return {
    ...state,
    refreshData: fetchDashboardData,
    addChatMessage
  };
};
