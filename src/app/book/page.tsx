import { createClient } from '@/utils/supabase/server';
import type { Database } from '@/types/database';
import { BookingForm } from '@/components/BookingForm';

async function getServices() {
  try {
    console.log('Creating Supabase client...');
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    // Debug: Umgebungsvariablen
    console.log('Environment check:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 10) + '...',
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });

    // Supabase Client erstellen
    const supabase = await createClient();
    
    // Debug: Einfache Testabfrage
    const { data: test, error: testError } = await supabase
      .from('services')
      .select('count')
      .single();
      
    if (testError) {
      console.error('Test query failed:', {
        code: testError.code,
        message: testError.message,
        details: testError.details,
        hint: testError.hint
      });
      throw testError;
    }

    console.log('Supabase client created successfully');
    
    console.log('Fetching services from Supabase...');
    
    // Hauptabfrage
    console.log('Running main query...');
    const { data: services, error } = await supabase
      .from('services')
      .select(`
        id,
        title,
        description,
        duration,
        price,
        image_url,
        is_active,
        category_id,
        service_categories (
          name
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Main query error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    if (!services || services.length === 0) {
      console.log('No services found in database');
      return [];
    }

    console.log('Query successful, found services:', services.length);
    console.log('Successfully fetched services:', services);
    return services;
  } catch (error) {
    // Detaillierte Fehlerausgabe
    const errorDetails = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      code: error && typeof error === 'object' && 'code' in error ? error.code : undefined,
      details: error && typeof error === 'object' && 'details' in error ? error.details : undefined,
      hint: error && typeof error === 'object' && 'hint' in error ? error.hint : undefined,
    };
    console.error('Failed to fetch services:', errorDetails);
    throw error; // Re-throw to show the actual error in the UI
  }
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const services = await getServices();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Termin buchen</h1>
      {services && services.length > 0 ? (
        <BookingForm
          services={services}
          initialServiceId={
            searchParams?.service && typeof searchParams.service === 'string'
              ? searchParams.service
              : undefined
          }
        />
      ) : (
        <p className="text-center text-gray-600">
          Aktuell sind keine Dienstleistungen verfügbar.
        </p>
      )}
    </div>
  );
}
