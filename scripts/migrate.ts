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

    // Lese die SQL-Datei
    const sql = readFileSync(resolve(process.cwd(), 'supabase/migrations/20250110000000_init.sql'), 'utf8')

    // Führe die Migration aus
    const { error } = await supabase.from('_migrations').insert({
      name: '20250110000000_init.sql',
      executed_at: new Date().toISOString()
    })

    if (error) {
      if (error.code === '23505') { // Unique violation
        console.log('Migration already executed')
        return
      }
      throw error
    }

    // Führe die SQL-Befehle aus
    const { error: sqlError } = await supabase.rpc('exec', { sql })
    if (sqlError) throw sqlError

    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()
