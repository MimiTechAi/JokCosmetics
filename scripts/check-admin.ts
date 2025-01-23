import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkAdmin() {
  try {
    // Überprüfe Auth-Benutzer
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    console.log('\nAuth-Benutzer:');
    console.log(authData.users);

    // Überprüfe Admin-Tabelle
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*');

    if (adminError) throw adminError;

    console.log('\nAdmin-Einträge:');
    console.log(adminData);

  } catch (error) {
    console.error('\nFehler beim Überprüfen des Admin-Accounts:', error);
  }
}

checkAdmin();
