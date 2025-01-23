import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createAdmin() {
  const email = 'thansuda22@googlemail.com';
  const password = 'Liasophie5812';

  try {
    // Erstelle den Auth-Account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) throw authError;

    // Erstelle den Admin-Eintrag
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert([{ email }]);

    if (adminError) throw adminError;

    console.log('\nAdmin-Account erfolgreich erstellt!');
    console.log(`E-Mail: ${email}`);
    console.log('Sie können sich jetzt unter /login anmelden.');
  } catch (error) {
    console.error('\nFehler beim Erstellen des Admin-Accounts:', error);
  }
}

createAdmin();
