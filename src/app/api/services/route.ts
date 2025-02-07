import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('category');

    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json(
        { error: 'Fehler beim Laden der Dienstleistungen' },
        { status: 500 }
      );
    }

    if (!services) {
      return NextResponse.json({ services: [] });
    }

    // Gruppiere Services nach Kategorien
    const groupedServices = services.reduce((acc: { [key: string]: any[] }, service) => {
      const category = service.category_id || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {});

    return NextResponse.json(groupedServices);
  } catch (error) {
    console.error('Error in services route:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}
