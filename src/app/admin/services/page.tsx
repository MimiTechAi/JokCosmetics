'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import dynamic from 'next/dynamic';
const EditServiceModal = dynamic(() => import('@/components/EditServiceModal'), { ssr: false });
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
import { Database } from '@/types/database';
import { Json } from '@/types/supabase';

interface Service {
  id: string;
  name: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  category_id: string | null;
  image_url: string;
  is_active: boolean;
  before_after_images: string[] | null;
  benefits: string[] | null;
  created_at: string | null;
  custom_fields: Json;
  video_url: string | null;
}

interface ServiceFormData {
  id?: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category_id?: string;
}

const fetchServices = async (supabase: ReturnType<typeof createClient>) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data?.map(service => ({
      ...service,
      duration: Number(service.duration),
      price: Number(service.price),
      name: service.title // Ensure name exists
    })) as Service[];
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchServices(supabase);
      setServices(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      toast({
        title: 'Error',
        description: 'Failed to load services',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      await loadServices();
      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete service',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (values: Service) => {
    if (!values.id) return;
    
    const updateData = {
      ...values,
      duration: values.duration.toString(),
      price: values.price.toString()
    };
    
    await supabase
      .from('services')
      .update(updateData)
      .eq('id', values.id);
  };

  const handleCreate = async (values: Omit<Service, 'id'>) => {
    const createData = {
      ...values,
      duration: values.duration.toString(),
      price: values.price.toString()
    };
    
    await supabase
      .from('services')
      .insert(createData);
  };

  const handleSave = async (serviceData: { name: string; duration: number; price: number; id?: string; description?: string; category?: string }) => {
    try {
      const fullServiceData = {
        ...serviceData,
        title: serviceData.name,
        image_url: '',
        is_active: true,
        category_id: serviceData.category || null,
        before_after_images: null,
        benefits: null,
        created_at: null,
        custom_fields: {},
        video_url: null,
        description: serviceData.description || ''
      };

      if (serviceData.id) {
        await handleUpdate(fullServiceData as Service);
      } else {
        await handleCreate(fullServiceData);
      }
      await loadServices();
      toast({
        title: 'Success',
        description: 'Service saved successfully'
      });
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: 'Failed to save service',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add New Service</Button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.price}€</TableCell>
              <TableCell>{service.duration} minutes</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(service)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(service.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isModalOpen && (
        <EditServiceModal
          isOpen={isModalOpen}
          service={selectedService}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
            loadServices();
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
