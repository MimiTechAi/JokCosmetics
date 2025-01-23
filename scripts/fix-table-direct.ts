import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixTableDirect() {
  const email = 'thansuda22@googlemail.com';

  try {
    // Versuche den vorhandenen Eintrag zu löschen
    const { error: deleteError } = await supabase
      .from('admin_users')
      .delete()
      .eq('email', email);

    if (deleteError) {
      console.log('Fehler beim Löschen (ignorieren wenn nicht existiert):', deleteError);
    }

    // Füge den Admin-Eintrag hinzu
    const { data, error: insertError } = await supabase
      .from('admin_users')
      .insert([{ email }])
      .select();

    if (insertError) throw insertError;

    console.log('\nAdmin-Eintrag erfolgreich erstellt!');
    console.log(data);
  } catch (error) {
    console.error('\nFehler beim Erstellen des Admin-Eintrags:', error);
  }
}

fixTableDirect();
