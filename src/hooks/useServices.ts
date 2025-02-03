import { useState, useEffect } from 'react';
import { Service, ServiceCategory } from '@/lib/services/types';
import { ServiceRepository } from '@/lib/services/service-repository';

export function useServices() {
  const [data, setData] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setIsLoading(true);
        const services = await ServiceRepository.getServices();
        setData(services);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch services'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []);

  return {
    data,
    isLoading,
    error
  };
}
