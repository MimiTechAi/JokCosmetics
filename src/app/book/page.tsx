import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { BookingForm } from '@/components/BookingForm';
import { PageContainer } from '@/components/PageContainer';

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

          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
            <BookingForm services={services} />
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-xl bg-white shadow-lg">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexible Termine</h3>
              <p className="text-gray-600">Wählen Sie aus verschiedenen Terminen, die am besten zu Ihrem Zeitplan passen</p>
            </div>

            <div className="p-6 rounded-xl bg-white shadow-lg">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Professioneller Service</h3>
              <p className="text-gray-600">Genießen Sie erstklassige Behandlungen von unseren erfahrenen Experten</p>
            </div>

            <div className="p-6 rounded-xl bg-white shadow-lg">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Sichere Buchung</h3>
              <p className="text-gray-600">Einfache und sichere Online-Terminbuchung mit sofortiger Bestätigung</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
