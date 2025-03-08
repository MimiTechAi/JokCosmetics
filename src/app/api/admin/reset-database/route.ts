import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

// Erstelle einen Supabase-Client mit Service-Role-Key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const dynamic = 'force-dynamic';

// Deaktiviere Authentifizierung für diese Route während der Entwicklung
const isDevelopment = process.env.NODE_ENV === 'development';

export async function POST() {
  try {
    console.log('Starting database reset...');

    // Überprüfe Authentifizierung nur in Produktion
    if (!isDevelopment) {
      return NextResponse.json(
        { error: 'Nicht autorisiert - Diese Route ist nur in der Entwicklung verfügbar' },
        { status: 401 }
      );
    }

    // Lösche alle Services mit einer RPC-Funktion
    const { data: servicesData, error: servicesError } = await supabase
      .rpc('truncate_table', { table_name: 'services' });

    if (servicesError) {
      console.error('Services truncate error:', servicesError);
      throw servicesError;
    }

    // Lösche alle Buchungen mit einer RPC-Funktion
    const { data: bookingsData, error: bookingsError } = await supabase
      .rpc('truncate_table', { table_name: 'bookings' });

    if (bookingsError) {
      console.error('Bookings truncate error:', bookingsError);
      throw bookingsError;
    }

    console.log('Database reset successful!');
    
    return NextResponse.json({ 
      success: true,
      message: 'Datenbank erfolgreich zurückgesetzt'
    });

  } catch (error: any) {
    console.error('Database reset error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Fehler beim Zurücksetzen der Datenbank',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
