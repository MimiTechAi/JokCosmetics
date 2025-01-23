import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const rl = readline.createInterface({ input, output });

async function createAdmin() {
  console.log('Admin-Account erstellen\n');

  const email = await new Promise<string>(resolve => {
    rl.question('E-Mail-Adresse: ', resolve);
  });

  const password = await new Promise<string>(resolve => {
    rl.question('Passwort (min. 8 Zeichen): ', resolve);
  });

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
    console.log('Sie können sich jetzt unter /login anmelden.');
  } catch (error) {
    console.error('\nFehler beim Erstellen des Admin-Accounts:', error);
  } finally {
    rl.close();
  }
}

createAdmin();
