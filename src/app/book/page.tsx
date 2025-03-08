import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { BookingForm } from '@/components/BookingForm';
import { PageContainer } from '@/components/PageContainer';
import { PriceList } from '@/components/PriceList';

interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  category_id: string | null;
  service_categories: {
    id: string;
    name: string;
  } | null;
}

async function getServices() {
  try {
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

    const formattedServices = services.map((service) => ({
      ...service,
      price: parseFloat(service.price.toString()),
      category_id: service.category_id || '',
      service_categories: service.service_categories && service.service_categories.length > 0 ? service.service_categories[0] : null
    }));

    return formattedServices;
  } catch (error) {
    console.error('Error in getServices:', error);
    return [];
  }
}

export default async function BookPage() {
  const services = await getServices();

  return (
    <PageContainer>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Buchen Sie Ihren Termin
            </h1>
            <p className="text-gray-600 text-lg">
              Wählen Sie Ihre gewünschte Behandlung und finden Sie einen passenden Termin
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90 mb-16">
            <PriceList />
          </div>

          <div id="booking-form" className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
            <h2 className="text-2xl font-semibold mb-6">Termin buchen</h2>
            <BookingForm services={services} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
