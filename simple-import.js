// Einfaches Import-Skript für Dienstleistungen in Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ES Module Workaround für __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local laden
dotenv.config({ path: resolve(__dirname, '.env.local') });

// Supabase-Client erstellen (mit Service Role Key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Fehler: Supabase-Konfiguration fehlt in der .env.local Datei');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Service Key vorhanden:', supabaseServiceKey ? 'Ja' : 'Nein');

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Servicekategorien
const serviceCategories = [
  { name: 'Permanent Make-up', sort_order: 1 },
  { name: 'Nachbehandlungen', sort_order: 2 },
  { name: 'Wimpernverlängerung', sort_order: 3 },
  { name: 'Gesichtsbehandlung', sort_order: 4 },
  { name: 'Zusätzliche Leistungen', sort_order: 5 }
];

async function importData() {
  try {
    console.log('Starte Import der Daten...');

    // Kategorien einfügen und IDs speichern
    console.log('Importiere Servicekategorien...');
    const categoryIds = {};
    
    for (let i = 0; i < serviceCategories.length; i++) {
      const category = serviceCategories[i];
      const { data, error } = await supabase
        .from('service_categories')
        .insert([category])
        .select();
      
      if (error) {
        console.error(`Fehler beim Importieren der Kategorie ${category.name}:`, error);
        continue;
      }
      
      if (data && data.length > 0) {
        categoryIds[i + 1] = data[0].id; // Speichere die UUID für die Kategorie
        console.log(`✅ Kategorie "${category.name}" importiert mit ID: ${data[0].id}`);
      }
    }
    
    console.log('Kategorien-IDs:', categoryIds);
    
    // Dienstleistungen mit den neuen Kategorie-IDs einfügen
    console.log('Importiere Dienstleistungen...');
    
    // Dienstleistungen nach Kategorien
    const servicesByCategory = {
      // Permanent Make-up
      '1': [
        { title: 'POWDERBROWS/OMBRÉ BROWS', description: 'Powder Brows (Schattierung) durch Permanent Make-up', duration: '120 Min', price: 249, sort_order: 1 },
        { title: 'SENSUAL LIPS (MIT KONTUR)', description: 'Natürliche Lippenkontur und -schattierung', duration: '120 Min', price: 259, sort_order: 2 },
        { title: 'AQUARELL LIPS', description: 'Aquarell-Technik für sanft schattierte Lippen', duration: '120 Min', price: 249, sort_order: 3 },
        { title: 'DARK LIPS NEUTRALIZATION', description: 'Neutralisierung dunkler Lippen', duration: '120 Min', price: 249, sort_order: 4 }
      ],
      
      // Nachbehandlungen
      '2': [
        { title: 'ERSTE NACHARBEIT', description: 'Erste Auffrischung des Permanent Make-ups innerhalb von 6 Wochen', duration: '120 Min', price: 69, sort_order: 1 },
        { title: 'ZWEITE NACHARBEIT', description: 'Zweite Auffrischung des Permanent Make-ups innerhalb von 6 Wochen', duration: '90 Min', price: 59, sort_order: 2 },
        { title: 'AUFFRISCHUNG INNERHALB VON 18 MONATE', description: 'Auffrischung des bestehenden Permanent Make-ups', duration: '120 Min', price: 159, sort_order: 3 }
      ],
      
      // Wimpernverlängerung
      '3': [
        { title: 'MEGA VOLUMEN (AB 5D)', description: 'Mega-Volumen (ab 5D)', duration: '120 Min', price: 125, sort_order: 1 },
        { title: 'LIGHT VOLUMEN (2D-4D)', description: 'Leichtes Volumen-Finish mit 2-4 Wimpern pro Naturwimper', duration: '120 Min', price: 115, sort_order: 2 },
        { title: '1:1 TECHNIK', description: 'Klassische Wimpernverlängerung mit natürlichem Effekt', duration: '120 Min', price: 99, sort_order: 3 },
        { title: 'BIS ZU 2 WOCHEN (MEGA VOLUMEN)', description: 'Auffüllen Mega Volumen bis zu 2 Wochen', duration: '60 Min', price: 55, sort_order: 4 },
        { title: 'BIS ZU 3 WOCHEN (MEGA VOLUMEN)', description: 'Auffüllen Mega Volumen bis zu 3 Wochen', duration: '75 Min', price: 65, sort_order: 5 },
        { title: 'BIS ZU 4 WOCHEN (MEGA VOLUMEN)', description: 'Auffüllen Mega Volumen bis zu 4 Wochen', duration: '90 Min', price: 75, sort_order: 6 },
        { title: 'BIS ZU 2 WOCHEN (LIGHT VOLUMEN)', description: 'Auffüllen Light Volumen bis zu 2 Wochen', duration: '60 Min', price: 50, sort_order: 7 },
        { title: 'BIS ZU 3 WOCHEN (LIGHT VOLUMEN)', description: 'Auffüllen Light Volumen bis zu 3 Wochen', duration: '75 Min', price: 60, sort_order: 8 },
        { title: 'BIS ZU 4 WOCHEN (LIGHT VOLUMEN)', description: 'Auffüllen Light Volumen bis zu 4 Wochen', duration: '90 Min', price: 70, sort_order: 9 },
        { title: 'BIS ZU 2 WOCHEN (1:1 TECHNIK)', description: 'Auffüllen 1:1 Technik bis zu 2 Wochen', duration: '60 Min', price: 45, sort_order: 10 },
        { title: 'BIS ZU 3 WOCHEN (1:1 TECHNIK)', description: 'Auffüllen 1:1 Technik bis zu 3 Wochen', duration: '75 Min', price: 55, sort_order: 11 },
        { title: 'BIS ZU 4 WOCHEN (1:1 TECHNIK)', description: 'Auffüllen 1:1 Technik bis zu 4 Wochen', duration: '90 Min', price: 65, sort_order: 12 }
      ],
      
      // Gesichtsbehandlung
      '4': [
        { title: 'BROWLIFTING (INKL FÄRBEN)', description: 'Browlifting mit Färben', duration: '45 Min', price: 45, sort_order: 1 },
        { title: 'MICRONEEDLING', description: 'Intensive Hautverbesserung durch Microneedling', duration: '45 Min', price: 69, sort_order: 2 },
        { title: 'BB GLOW', description: 'BB Glow Behandlung', duration: '45 Min', price: 79, sort_order: 3 },
        { title: 'MICRONEEDLING & BB GLOW', description: 'Kombination aus Microneedling und BB Glow für optimale Ergebnisse', duration: '90 Min', price: 99, sort_order: 4 }
      ],
      
      // Zusätzliche Leistungen
      '5': [
        { title: 'WISPY / WET SET', description: 'Wispy oder Wet Set Styling', duration: '30 Min', price: 10, sort_order: 1 },
        { title: 'FREMDARBEIT AUFFÜLLEN', description: 'Auffüllen von Wimpernverlängerungen anderer Studios', duration: '120 Min', price: 80, sort_order: 2 },
        { title: 'WIMPERN ENTFERNEN', description: 'Professionelles Entfernen von Wimpernverlängerungen', duration: '30 Min', price: 20, sort_order: 3 }
      ]
    };
    
    let totalServices = 0;
    let importedServices = 0;
    
    for (const categoryId in servicesByCategory) {
      if (categoryIds[categoryId]) {
        const services = servicesByCategory[categoryId];
        totalServices += services.length;
        
        for (const service of services) {
          const serviceData = {
            ...service,
            category_id: categoryIds[categoryId]
          };
          
          const { data, error } = await supabase
            .from('services')
            .insert([serviceData])
            .select();
          
          if (error) {
            console.error(`Fehler beim Importieren des Services "${service.title}":`, error);
            continue;
          }
          
          if (data && data.length > 0) {
            importedServices++;
            console.log(`✅ Service "${service.title}" importiert mit ID: ${data[0].id}`);
          }
        }
      }
    }

    console.log(`Import abgeschlossen! ${importedServices} von ${totalServices} Dienstleistungen importiert.`);
    
    // Überprüfen, ob die Daten erfolgreich importiert wurden
    const { data: categoriesCount, error: countCatError } = await supabase
      .from('service_categories')
      .select('*', { count: 'exact' });
      
    const { data: servicesCount, error: countServError } = await supabase
      .from('services')
      .select('*', { count: 'exact' });
    
    if (!countCatError && !countServError) {
      console.log(`Anzahl der Kategorien: ${categoriesCount.length}`);
      console.log(`Anzahl der Dienstleistungen: ${servicesCount.length}`);
    }
    
  } catch (error) {
    console.error('Fehler beim Import:', error);
  }
}

// Daten importieren
importData();
