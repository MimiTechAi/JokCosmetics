import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// Lade Umgebungsvariablen aus .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function migrate() {
  try {
    console.log('Starting migration...')

    // Erstelle die Tabellen
    const { error: customersError } = await supabase.from('customers').insert({}).select().limit(0)
    if (customersError && !customersError.message.includes('already exists')) {
      throw customersError
    }

    const { error: servicesError } = await supabase.from('services').insert({}).select().limit(0)
    if (servicesError && !servicesError.message.includes('already exists')) {
      throw servicesError
    }

    const { error: bookingsError } = await supabase.from('bookings').insert({}).select().limit(0)
    if (bookingsError && !bookingsError.message.includes('already exists')) {
      throw bookingsError
    }

    // Füge Beispiel-Services ein
    const services = [
      {
        name: 'Augenbrauen Lamination',
        description: 'Professionelle Augenbrauen-Lamination für definierte Brauen',
        duration: 60,
        price: 49,
        category: 'Augenbrauen',
        image_url: '/images/services/powder-brows.jpg',
        is_active: true,
        available_days: ['1', '2', '3', '4', '5', '6']
      },
      {
        name: 'Wimpern Classic',
        description: 'Klassische Wimpernverlängerung für einen natürlichen Look',
        duration: 90,
        price: 79,
        category: 'Wimpern',
        image_url: '/images/services/lashes-classic.jpg',
        is_active: true,
        available_days: ['1', '2', '3', '4', '5', '6']
      },
      {
        name: 'Wimpern Volume',
        description: 'Volume Wimpernverlängerung für einen dramatischen Look',
        duration: 120,
        price: 99,
        category: 'Wimpern',
        image_url: '/images/services/lashes-volume.jpg',
        is_active: true,
        available_days: ['1', '2', '3', '4', '5', '6']
      },
      {
        name: 'Powder Brows',
        description: 'Powder Brows für natürlich aussehende, definierte Augenbrauen',
        duration: 120,
        price: 299,
        category: 'Permanent Make-up',
        image_url: '/images/services/powder-brows-new.jpg',
        is_active: true,
        available_days: ['1', '2', '3', '4', '5', '6']
      }
    ]

    const { error: insertError } = await supabase.from('services').upsert(services, {
      onConflict: 'name'
    })
    if (insertError) throw insertError

    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()
