import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Hole alle Services
    const { data: services, error } = await supabase
      .from('services')
      .select('*');

    if (error) {
      console.error('Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Hole auch die RLS Policies
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'services' });

    return NextResponse.json({
      services,
      policies,
      serviceCount: services?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in debug route:', error);
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
