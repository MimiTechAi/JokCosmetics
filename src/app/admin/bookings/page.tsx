'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Booking {
  id: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string;
  service: {
    name: string;
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customers(
            first_name,
            last_name,
            email,
            phone
          ),
          service:services(
            name
          )
        `)
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Buchungen:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      booking.customer?.first_name?.toLowerCase().includes(searchString) ||
      booking.customer?.last_name?.toLowerCase().includes(searchString) ||
      booking.customer?.email?.toLowerCase().includes(searchString) ||
      booking.customer?.phone?.toLowerCase().includes(searchString) ||
      booking.notes?.toLowerCase().includes(searchString);

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd.MM.yyyy', { locale: de });
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-6 bg-gradient-to-b from-pink-50 to-white">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-pink-500">
              Buchungsverwaltung
            </h1>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Suche nach Kunden, Email oder Notizen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-md focus:border-pink-500 focus:ring-pink-500"
                >
                  <option value="all">Alle Status</option>
                  <option value="confirmed">Bestätigt</option>
                  <option value="pending">Ausstehend</option>
                  <option value="cancelled">Storniert</option>
                </select>
                <Button 
                  onClick={fetchBookings}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Aktualisieren
                </Button>
              </div>

              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-gray-600">Datum</TableHead>
                      <TableHead className="text-gray-600">Uhrzeit</TableHead>
                      <TableHead className="text-gray-600">Kunde</TableHead>
                      <TableHead className="text-gray-600">Kontakt</TableHead>
                      <TableHead className="text-gray-600">Service</TableHead>
                      <TableHead className="text-gray-600">Status</TableHead>
                      <TableHead className="text-gray-600">Notizen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
                            <span className="text-gray-500">Laden...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          Keine Buchungen gefunden
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((booking) => (
                        <TableRow 
                          key={booking.id}
                          className="hover:bg-pink-50 transition-colors"
                        >
                          <TableCell className="text-gray-700">
                            {formatDate(booking.booking_date)}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {formatTime(booking.booking_time)}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {booking.customer?.first_name} {booking.customer?.last_name}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            <div className="text-sm">
                              <div>{booking.customer?.email}</div>
                              <div>{booking.customer?.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {booking.service?.name}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status === 'confirmed' ? 'Bestätigt' :
                               booking.status === 'cancelled' ? 'Storniert' : 
                               'Ausstehend'}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {booking.notes}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
