import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function PUT(request: Request) {
  try {
    const service = await request.json();

    const { data, error } = await supabase
      .from('services')
      .update({
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
        is_active: service.is_active
      })
      .eq('id', service.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'Service erfolgreich aktualisiert',
      service: data
    });

  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Fehler beim Aktualisieren des Services',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
