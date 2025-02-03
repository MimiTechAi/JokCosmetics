'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import EditServiceModal from '@/components/EditServiceModal';
import { Service } from '@/types/service';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Möchten Sie diesen Service wirklich löschen?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      await fetchServices();
    } catch (error) {
      console.error('Fehler beim Löschen des Services:', error);
    }
  };

  const handleSave = async (updatedService: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .upsert(updatedService);

      if (error) throw error;

      setIsModalOpen(false);
      await fetchServices();
    } catch (error) {
      console.error('Fehler beim Speichern des Services:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Lade Services...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services verwalten</h1>
        <Button 
          onClick={() => {
            setSelectedService(null);
            setIsModalOpen(true);
          }}
        >
          Neuer Service
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Kategorie</TableHead>
            <TableHead>Dauer (Min)</TableHead>
            <TableHead>Preis (€)</TableHead>
            <TableHead>Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.category || 'Allgemein'}</TableCell>
              <TableCell>{service.duration}</TableCell>
              <TableCell>{service.price.toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(service)}
                  className="mr-2"
                >
                  Bearbeiten
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                >
                  Löschen
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isModalOpen && (
        <EditServiceModal
          service={selectedService}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
