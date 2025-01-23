import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';
import { BookingForm } from '@/components/BookingForm';

async function getServices() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true });
  
  return services || [];
}

export default async function BookPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Termin buchen
        </h1>
        <BookingForm initialServices={services} />
      </div>
    </div>
  );
}
