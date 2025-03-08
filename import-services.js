// Import-Skript für Dienstleistungen in Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ES Module Workaround für __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local laden
dotenv.config({ path: resolve(__dirname, '.env.local') });

// Supabase-Client erstellen
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Servicekategorien
const serviceCategories = [
  { id: '1', name: 'Permanent Make-up', sort_order: 1 },
  { id: '2', name: 'Nachbehandlungen', sort_order: 2 },
  { id: '3', name: 'Wimpernverlängerung', sort_order: 3 },
  { id: '4', name: 'Gesichtsbehandlung', sort_order: 4 },
  { id: '5', name: 'Zusätzliche Leistungen', sort_order: 5 }
];

// Dienstleistungen
const services = [
  // Permanent Make-up
  { id: '101', title: 'POWDERBROWS/OMBRÉ BROWS', description: 'Powder Brows (Schattierung) durch Permanent Make-up', duration: '120 Min', price: 249, category_id: '1', sort_order: 1 },
  { id: '102', title: 'SENSUAL LIPS (MIT KONTUR)', description: 'Natürliche Lippenkontur und -schattierung', duration: '120 Min', price: 259, category_id: '1', sort_order: 2 },
  { id: '103', title: 'AQUARELL LIPS', description: 'Aquarell-Technik für sanft schattierte Lippen', duration: '120 Min', price: 249, category_id: '1', sort_order: 3 },
  { id: '104', title: 'DARK LIPS NEUTRALIZATION', description: 'Neutralisierung dunkler Lippen', duration: '120 Min', price: 249, category_id: '1', sort_order: 4 },

  // Nachbehandlungen
  { id: '201', title: 'ERSTE NACHARBEIT', description: 'Erste Auffrischung des Permanent Make-ups innerhalb von 6 Wochen', duration: '120 Min', price: 69, category_id: '2', sort_order: 1 },
  { id: '202', title: 'ZWEITE NACHARBEIT', description: 'Zweite Auffrischung des Permanent Make-ups innerhalb von 6 Wochen', duration: '90 Min', price: 59, category_id: '2', sort_order: 2 },
  { id: '203', title: 'AUFFRISCHUNG INNERHALB VON 18 MONATE', description: 'Auffrischung des bestehenden Permanent Make-ups', duration: '120 Min', price: 159, category_id: '2', sort_order: 3 },

  // Wimpernverlängerung
  { id: '301', title: 'MEGA VOLUMEN (AB 5D)', description: 'Mega-Volumen (ab 5D)', duration: '120 Min', price: 125, category_id: '3', sort_order: 1 },
  { id: '302', title: 'LIGHT VOLUMEN (2D-4D)', description: 'Leichtes Volumen-Finish mit 2-4 Wimpern pro Naturwimper', duration: '120 Min', price: 115, category_id: '3', sort_order: 2 },
  { id: '303', title: '1:1 TECHNIK', description: 'Klassische Wimpernverlängerung mit natürlichem Effekt', duration: '120 Min', price: 99, category_id: '3', sort_order: 3 },
  { id: '304', title: 'BIS ZU 2 WOCHEN (MEGA VOLUMEN)', description: 'Auffüllen Mega Volumen bis zu 2 Wochen', duration: '60 Min', price: 55, category_id: '3', sort_order: 4 },
  { id: '305', title: 'BIS ZU 3 WOCHEN (MEGA VOLUMEN)', description: 'Auffüllen Mega Volumen bis zu 3 Wochen', duration: '75 Min', price: 65, category_id: '3', sort_order: 5 },
  { id: '306', title: 'BIS ZU 4 WOCHEN (MEGA VOLUMEN)', description: 'Auffüllen Mega Volumen bis zu 4 Wochen', duration: '90 Min', price: 75, category_id: '3', sort_order: 6 },
  { id: '307', title: 'BIS ZU 2 WOCHEN (LIGHT VOLUMEN)', description: 'Auffüllen Light Volumen bis zu 2 Wochen', duration: '60 Min', price: 50, category_id: '3', sort_order: 7 },
  { id: '308', title: 'BIS ZU 3 WOCHEN (LIGHT VOLUMEN)', description: 'Auffüllen Light Volumen bis zu 3 Wochen', duration: '75 Min', price: 60, category_id: '3', sort_order: 8 },
  { id: '309', title: 'BIS ZU 4 WOCHEN (LIGHT VOLUMEN)', description: 'Auffüllen Light Volumen bis zu 4 Wochen', duration: '90 Min', price: 70, category_id: '3', sort_order: 9 },
  { id: '310', title: 'BIS ZU 2 WOCHEN (1:1 TECHNIK)', description: 'Auffüllen 1:1 Technik bis zu 2 Wochen', duration: '60 Min', price: 45, category_id: '3', sort_order: 10 },
  { id: '311', title: 'BIS ZU 3 WOCHEN (1:1 TECHNIK)', description: 'Auffüllen 1:1 Technik bis zu 3 Wochen', duration: '75 Min', price: 55, category_id: '3', sort_order: 11 },
  { id: '312', title: 'BIS ZU 4 WOCHEN (1:1 TECHNIK)', description: 'Auffüllen 1:1 Technik bis zu 4 Wochen', duration: '90 Min', price: 65, category_id: '3', sort_order: 12 },

  // Gesichtsbehandlung
  { id: '401', title: 'BROWLIFTING (INKL FÄRBEN)', description: 'Browlifting mit Färben', duration: '45 Min', price: 45, category_id: '4', sort_order: 1 },
  { id: '402', title: 'MICRONEEDLING', description: 'Intensive Hautverbesserung durch Microneedling', duration: '45 Min', price: 69, category_id: '4', sort_order: 2 },
  { id: '403', title: 'BB GLOW', description: 'BB Glow Behandlung', duration: '45 Min', price: 79, category_id: '4', sort_order: 3 },
  { id: '404', title: 'MICRONEEDLING & BB GLOW', description: 'Kombination aus Microneedling und BB Glow für optimale Ergebnisse', duration: '90 Min', price: 99, category_id: '4', sort_order: 4 },

  // Zusätzliche Leistungen
  { id: '501', title: 'WISPY / WET SET', description: 'Wispy oder Wet Set Styling', duration: '30 Min', price: 10, category_id: '5', sort_order: 1 },
  { id: '502', title: 'FREMDARBEIT AUFFÜLLEN', description: 'Auffüllen von Wimpernverlängerungen anderer Studios', duration: '120 Min', price: 80, category_id: '5', sort_order: 2 },
  { id: '503', title: 'WIMPERN ENTFERNEN', description: 'Professionelles Entfernen von Wimpernverlängerungen', duration: '30 Min', price: 20, category_id: '5', sort_order: 3 }
];

async function importData() {
  try {
    console.log('Starte Import der Daten...');

    // Kategorien einfügen
    console.log('Importiere Servicekategorien...');
    const { error: categoriesError } = await supabase
      .from('service_categories')
      .upsert(serviceCategories, { onConflict: 'id' });

    if (categoriesError) {
      throw categoriesError;
    }
    console.log('✅ Servicekategorien erfolgreich importiert');

    // Dienstleistungen einfügen
    console.log('Importiere Dienstleistungen...');
    const { error: servicesError } = await supabase
      .from('services')
      .upsert(services, { onConflict: 'id' });

    if (servicesError) {
      throw servicesError;
    }
    console.log('✅ Dienstleistungen erfolgreich importiert');

    console.log('Import abgeschlossen!');
  } catch (error) {
    console.error('Fehler beim Import:', error);
  }
}

// Daten importieren
importData();
