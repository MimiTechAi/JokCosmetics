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

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchString = searchTerm.toLowerCase();
    return (
      customer.first_name?.toLowerCase().includes(searchString) ||
      customer.last_name?.toLowerCase().includes(searchString) ||
      customer.email?.toLowerCase().includes(searchString) ||
      customer.phone?.toLowerCase().includes(searchString)
    );
  });

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
              Kundenverwaltung
            </h1>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Suche nach Namen, Email oder Telefon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <Button 
                  onClick={fetchCustomers}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Aktualisieren
                </Button>
              </div>

              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-gray-600">Vorname</TableHead>
                      <TableHead className="text-gray-600">Nachname</TableHead>
                      <TableHead className="text-gray-600">Email</TableHead>
                      <TableHead className="text-gray-600">Telefon</TableHead>
                      <TableHead className="text-gray-600">Erstellt am</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
                            <span className="text-gray-500">Laden...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          Keine Kunden gefunden
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <TableRow 
                          key={customer.id}
                          className="hover:bg-pink-50 transition-colors"
                        >
                          <TableCell className="text-gray-700">{customer.first_name}</TableCell>
                          <TableCell className="text-gray-700">{customer.last_name}</TableCell>
                          <TableCell className="text-gray-700">{customer.email}</TableCell>
                          <TableCell className="text-gray-700">{customer.phone}</TableCell>
                          <TableCell className="text-gray-700">
                            {new Date(customer.created_at).toLocaleDateString('de-DE')}
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
