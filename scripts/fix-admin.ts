import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixAdmin() {
  const email = 'thansuda22@googlemail.com';

  try {
    // Füge den Admin-Eintrag hinzu
    const { data, error } = await supabase
      .from('admin_users')
      .insert([{ email }])
      .select();

    if (error) throw error;

    console.log('\nAdmin-Eintrag erfolgreich erstellt!');
    console.log(data);
  } catch (error) {
    console.error('\nFehler beim Erstellen des Admin-Eintrags:', error);
  }
}

fixAdmin();
