import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rttrdlnidqcstsdacmrw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initial-Daten für Services
const initialServices = [
  {
    name: 'Powderbrows',
    description: 'Natürlich aussehende, gepuderte Augenbrauen mit modernster Technik für einen perfekten Look.',
    duration: 180, // 3 Stunden
    price: 399.00
  },
  {
    name: 'Wimpernverlängerung Classic',
    description: 'Klassische Wimpernverlängerung für einen natürlichen, ausdrucksstarken Blick.',
    duration: 120, // 2 Stunden
    price: 159.00
  },
  {
    name: 'Wimpernverlängerung Volume',
    description: 'Voluminöse Wimpernverlängerung für einen dramatischen, glamourösen Look.',
    duration: 150, // 2.5 Stunden
    price: 189.00
  },
  {
    name: 'Microblading',
    description: 'Präzise und naturgetreue Augenbrauengestaltung mit feinster Härchentechnik.',
    duration: 180, // 3 Stunden
    price: 449.00
  },
  {
    name: 'Auffrischung Powderbrows',
    description: 'Auffrischung Ihrer Powderbrows für ein langanhaltend perfektes Ergebnis.',
    duration: 120, // 2 Stunden
    price: 199.00
  }
];

async function initializeDatabase() {
  try {
    // 1. Services einfügen
    const { error: servicesError } = await supabase
      .from('services')
      .upsert(initialServices, { onConflict: 'name' });

    if (servicesError) {
      throw servicesError;
    }

    console.log('✓ Services wurden erfolgreich initialisiert');

    // 2. RLS-Policies überprüfen
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies');

    if (policiesError) {
      console.warn('Warnung: Konnte Policies nicht überprüfen');
    } else {
      console.log('✓ RLS-Policies sind aktiv');
    }

    console.log('Datenbank wurde erfolgreich initialisiert! 🎉');

  } catch (error) {
    console.error('Fehler bei der Datenbankinitialisierung:', error);
    throw error;
  }
}

// Funktion zum Testen der Verbindung
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('name')
      .limit(1);

    if (error) throw error;
    console.log('✓ Datenbankverbindung erfolgreich getestet');
    return true;
  } catch (error) {
    console.error('Fehler bei der Verbindung:', error);
    return false;
  }
}

// Führe die Initialisierung aus
async function main() {
  console.log('Starte Datenbankinitialisierung...');
  
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('Konnte keine Verbindung zur Datenbank herstellen');
    process.exit(1);
  }

  await initializeDatabase();
}

// Nur ausführen, wenn direkt aufgerufen
if (require.main === module) {
  main().catch(console.error);
}
