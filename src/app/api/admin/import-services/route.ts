import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

// Erstelle einen Supabase-Client mit Service-Role-Key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET() {
  console.log('Starting service import...');
  
  try {
    // Aktuelle Service-Liste
    const services = [
      {
        name: 'Wimpernverlängerung Classic',
        description: 'Natürlich aussehende Wimpernverlängerung mit 1:1 Technik',
        duration: 120,
        price: 89.00,
        category: 'Wimpern',
        image_url: '',
        is_active: true
      },
      {
        name: 'Wimpernverlängerung Volume',
        description: 'Voluminöse Wimpernverlängerung mit 3D-6D Technik',
        duration: 150,
        price: 119.00,
        category: 'Wimpern',
        image_url: '',
        is_active: true
      },
      {
        name: 'Wimpernverlängerung Mega Volume',
        description: 'Dramatische Wimpernverlängerung mit 6D-16D Technik',
        duration: 180,
        price: 149.00,
        category: 'Wimpern',
        image_url: '',
        is_active: true
      },
      {
        name: 'Wimpernlifting',
        description: 'Natürliches Lifting der eigenen Wimpern',
        duration: 60,
        price: 49.00,
        category: 'Wimpern',
        image_url: '',
        is_active: true
      },
      {
        name: 'Browlifting',
        description: 'Natürliches Lifting der Augenbrauen',
        duration: 45,
        price: 39.00,
        category: 'Augenbrauen',
        image_url: '',
        is_active: true
      },
      {
        name: 'Augenbrauen Lamination',
        description: 'Professionelle Augenbrauen-Lamination für definierte Brauen',
        duration: 60,
        price: 49.00,
        category: 'Augenbrauen',
        image_url: '',
        is_active: true
      },
      {
        name: 'Microblading',
        description: 'Semi-permanentes Augenbrauen-Microblading',
        duration: 120,
        price: 299.00,
        category: 'Permanent Make-up',
        image_url: '',
        is_active: true
      },
      {
        name: 'Lippen-Permanent',
        description: 'Semi-permanentes Lippen-Make-up',
        duration: 90,
        price: 249.00,
        category: 'Permanent Make-up',
        image_url: '',
        is_active: true
      },
      {
        name: 'Lidstrich-Permanent',
        description: 'Semi-permanenter Lidstrich',
        duration: 60,
        price: 199.00,
        category: 'Permanent Make-up',
        image_url: '',
        is_active: true
      },
      {
        name: 'Wimpernentfernung',
        description: 'Professionelle Entfernung von Wimpernextensions',
        duration: 45,
        price: 29.00,
        category: 'Wimpern',
        image_url: '',
        is_active: true
      }
    ];

    console.log('Deleting existing services...');
    
    // Lösche alle bestehenden Services
    const { error: deleteError } = await supabase
      .from('services')
      .delete()
      .gt('id', '0');

    if (deleteError) {
      console.error('Delete error:', deleteError);
      throw deleteError;
    }

    console.log('Inserting new services...');
    
    // Füge neue Services ein
    const { error: insertError } = await supabase
      .from('services')
      .insert(services);

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    console.log('Fetching updated services...');
    
    // Hole die aktualisierten Services
    const { data: updatedServices, error: fetchError } = await supabase
      .from('services')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }

    console.log('Import successful!');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Services erfolgreich importiert',
      services: updatedServices
    });

  } catch (error: any) {
    console.error('Import error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Fehler beim Importieren der Services',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
