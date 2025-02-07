'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
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
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

type NewService = Omit<Service, 'id' | 'is_active' | 'image_url'> & {
  id?: string;
  is_active?: boolean;
  image_url?: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadServices();
  }, []);

  const checkAuthAndLoadServices = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile?.role || profile.role !== 'admin') {
        router.push('/auth/login');
        return;
      }

      await fetchServices();
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/auth/login');
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('services')
        .select(`
          id,
          name,
          description,
          duration,
          price,
          category,
          is_active,
          image_url
        `)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      setServices(data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Laden der Services';
      console.error('Services error:', error);
      setError(message);
      toast({
        title: 'Fehler',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Service wirklich löschen?')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchServices();
      toast({
        title: 'Erfolg',
        description: 'Service wurde gelöscht',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Löschen des Services';
      console.error('Delete error:', error);
      setError(message);
      toast({
        title: 'Fehler',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (serviceData: NewService) => {
    try {
      setLoading(true);
      setError(null);

      const service = {
        ...serviceData,
        is_active: true,
        image_url: serviceData.image_url || '',
      };

      if (service.id) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update({
            name: service.name,
            description: service.description || '',
            price: service.price,
            duration: service.duration,
            category: service.category || '',
            is_active: true,
            image_url: service.image_url,
          })
          .eq('id', service.id);

        if (error) throw error;
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert([{
            name: service.name,
            description: service.description || '',
            price: service.price,
            duration: service.duration,
            category: service.category || '',
            is_active: true,
            image_url: service.image_url,
          }]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      await fetchServices();
      toast({
        title: 'Erfolg',
        description: `Service wurde ${service.id ? 'aktualisiert' : 'erstellt'}`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Speichern des Services';
      console.error('Save error:', error);
      setError(message);
      toast({
        title: 'Fehler',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Dienstleistungen</h1>
        <Button
          variant="luxury"
          onClick={() => {
            setSelectedService(null);
            setIsModalOpen(true);
          }}
        >
          Neue Dienstleistung
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-md bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      <div className="luxury-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Beschreibung</TableHead>
              <TableHead>Preis</TableHead>
              <TableHead>Dauer</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{service.price}€</TableCell>
                <TableCell>{service.duration} Min.</TableCell>
                <TableCell>{service.category}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
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
      </div>

      <EditServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        service={selectedService}
      />
    </div>
  );
}
