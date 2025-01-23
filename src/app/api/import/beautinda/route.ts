import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { BeautindaAPI } from '@/lib/beautinda';

export async function POST(request: Request) {
  const beautindaAPI = new BeautindaAPI();
  
  try {
    console.log('Starting Beautinda import...');
    
    // Erstelle Supabase-Client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Überprüfe Auth-Token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('No auth token provided');
      return NextResponse.json(
        { success: false, message: 'Kein Auth-Token vorhanden' },
        { status: 401 }
      );
    }

    // Parse Request-Body
    const body = await request.json();
    console.log('Received request body:', { ...body, beautindaPassword: '[REDACTED]' });
    
    const { beautindaEmail, beautindaPassword } = body;

    if (!beautindaEmail || !beautindaPassword) {
      return NextResponse.json(
        { success: false, message: 'E-Mail und Passwort sind erforderlich' },
        { status: 400 }
      );
    }

    // Initialisiere Browser
    await beautindaAPI.initialize();
    console.log('Browser initialized');

    // Login bei Beautinda
    const loginResult = await beautindaAPI.login({
      email: beautindaEmail,
      password: beautindaPassword
    });

    if (!loginResult.success) {
      console.error('Login failed:', loginResult.message);
      return NextResponse.json(
        { success: false, message: loginResult.message || 'Login fehlgeschlagen' },
        { status: 401 }
      );
    }

    // Hole Daten von Beautinda
    const bookings = await beautindaAPI.getBookings();
    const customers = await beautindaAPI.getCustomers();
    const services = await beautindaAPI.getServices();

    console.log(`Fetched data: ${bookings.length} bookings, ${customers.length} customers, ${services.length} services`);

    // Importiere Daten in Supabase
    const { error: customersError } = await supabase
      .from('customers')
      .upsert(customers, { onConflict: 'email' });

    if (customersError) {
      throw new Error(`Fehler beim Import der Kunden: ${customersError.message}`);
    }

    const { error: servicesError } = await supabase
      .from('services')
      .upsert(services, { onConflict: 'name' });

    if (servicesError) {
      throw new Error(`Fehler beim Import der Services: ${servicesError.message}`);
    }

    const { error: bookingsError } = await supabase
      .from('bookings')
      .upsert(bookings, { onConflict: 'id' });

    if (bookingsError) {
      throw new Error(`Fehler beim Import der Buchungen: ${bookingsError.message}`);
    }

    // Schließe Browser
    await beautindaAPI.close();

    return NextResponse.json({
      success: true,
      message: 'Import erfolgreich',
      data: {
        bookings: bookings.length,
        customers: customers.length,
        services: services.length
      }
    });

  } catch (error) {
    console.error('Import error:', error);
    
    // Versuche Browser zu schließen
    try {
      await beautindaAPI.close();
    } catch (closeError) {
      console.error('Error closing browser:', closeError);
    }

    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unbekannter Fehler beim Import'
      },
      { status: 500 }
    );
  }
}
