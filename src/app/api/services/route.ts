import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();

    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('category');

    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json({ error: 'Fehler beim Laden der Dienstleistungen' }, { status: 500 });
    }

    // Gruppiere Services nach Kategorien
    const groupedServices = services.reduce((acc: { [key: string]: any[] }, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service);
      return acc;
    }, {});

    return NextResponse.json(groupedServices);
  } catch (error) {
    console.error('Error in services route:', error);
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
