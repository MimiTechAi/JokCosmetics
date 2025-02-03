import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  totalCustomers: number;
  totalServices: number;
  monthlyRevenue: number;
}

interface Booking {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  service: {
    name: string;
    price: number;
  };
  booking_date: string;
  booking_time: string;
  status: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    upcomingBookings: 0,
    totalCustomers: 0,
    totalServices: 0,
    monthlyRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const loadStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split('T')[0];

      const [
        { count: totalBookings },
        { count: upcomingBookings },
        { count: totalCustomers },
        { count: totalServices },
        { data: monthlyBookings },
      ] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact' }),
        supabase
          .from('bookings')
          .select('*', { count: 'exact' })
          .gte('booking_date', today)
          .eq('status', 'confirmed'),
        supabase.from('customers').select('*', { count: 'exact' }),
        supabase.from('services').select('*', { count: 'exact' }),
        supabase
          .from('bookings')
          .select('service_id, services(price)')
          .gte('booking_date', firstDayOfMonth)
          .eq('status', 'completed'),
      ]);

      const monthlyRevenue = monthlyBookings?.reduce((sum, booking) => {
        return sum + (booking.services?.price || 0);
      }, 0) || 0;

      setStats({
        totalBookings: totalBookings || 0,
        upcomingBookings: upcomingBookings || 0,
        totalCustomers: totalCustomers || 0,
        totalServices: totalServices || 0,
        monthlyRevenue,
      });

      // Lade die letzten Buchungen
      const { data: recent } = await supabase
        .from('bookings')
        .select('*, customer:customer_id(name, email), service:service_id(name, price)')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentBookings(recent || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Dashboard-Daten:', error);
      setIsLoading(false);
    }
  };

  const addChatMessage = (content: string, role: 'user' | 'assistant') => {
    setChatMessages((prev) => [
      ...prev,
      { content, role, timestamp: new Date() },
    ]);
  };

  const refreshData = () => {
    setIsLoading(true);
    loadStats();
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    isLoading,
    stats,
    recentBookings,
    chatMessages,
    refreshData,
    addChatMessage,
  };
}
