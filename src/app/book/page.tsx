import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { BookingPageClient } from './BookingPageClient';

interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  category_id: string;
  service_categories: {
    id: string;
    name: string;
  } | null;
}

async function getServices() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: services, error } = await supabase
      .from('services')
      .select(`
        id,
        title,
        description,
        duration,
        price,
        category_id,
        service_categories (
          id,
          name
        )
      `)
      .order('sort_order');

    if (error) {
      throw error;
    }

    // Format services to match the expected Service interface
    const formattedServices = services.map(service => ({
      ...service,
      price: parseFloat(service.price.toString()),
      service_categories: service.service_categories && service.service_categories.length > 0 
        ? service.service_categories[0] 
        : null
    }));

    return formattedServices as Service[];
  } catch (error) {
    console.error('Error in getServices:', error);
    return [] as Service[];
  }
}

export default async function BookPage() {
  const services = await getServices();

  return <BookingPageClient services={services} />;
}
