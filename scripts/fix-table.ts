import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixTable() {
  try {
    // Drop and recreate the table
    const { error: dropError } = await supabase.rpc('drop_admin_users');
    if (dropError) throw dropError;

    const { error: createError } = await supabase.rpc('create_admin_users');
    if (createError) throw createError;

    console.log('Tabelle erfolgreich neu erstellt!');
  } catch (error) {
    console.error('Fehler beim Neuerstellen der Tabelle:', error);
  }
}

fixTable();
