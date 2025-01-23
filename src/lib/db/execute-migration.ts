import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://rttrdlnidqcstsdacmrw.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dHJkbG5pZHFjc3RzZGFjbXJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjE3ODE0NSwiZXhwIjoyMDUxNzU0MTQ1fQ.IkL2Q_JwO9TfUakuboIjTvm0kmNvPHwLna2ojO9NNWo';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeMigration() {
  try {
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250110000000_fix_notification_references.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    const { error } = await supabase.rpc('exec_sql', {
      sql_string: migrationSQL
    });

    if (error) {
      console.error('Migration error:', error);
      process.exit(1);
    }

    console.log('Migration successful!');
    process.exit(0);
  } catch (error) {
    console.error('Error executing migration:', error);
    process.exit(1);
  }
}

executeMigration();
