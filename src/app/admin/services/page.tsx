'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import EditServiceModal from '@/components/EditServiceModal';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  image_url: string;
  is_active: boolean;
}

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
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Services:', error);
      alert('Fehler beim Laden der Services');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedService: Service) => {
    try {
      const response = await fetch('/api/admin/update-service', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedService),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setServices(services.map(service => 
        service.id === updatedService.id ? updatedService : service
      ));

      setIsModalOpen(false);
      setSelectedService(null);
      alert('Service erfolgreich aktualisiert');
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error);
      alert('Fehler beim Aktualisieren des Services');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-radial from-pink-100 via-purple-50 to-blue-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* Animated Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Glowing Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 drop-shadow-lg">
              Services
            </span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="p-8 relative">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-pink-900">
                        {service.name}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      service.is_active 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
                        : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                    }`}>
                      {service.is_active ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
                      </svg>
                      {service.category}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {service.duration} Min.
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                      {formatPrice(service.price)}
                    </span>
                    <button
                      onClick={() => handleEdit(service)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Bearbeiten
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
