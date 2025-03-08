-- Tabellen erstellen, falls sie noch nicht existieren
CREATE TABLE IF NOT EXISTS service_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id TEXT REFERENCES service_categories(id),
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Servicekategorien einfügen
INSERT INTO service_categories (id, name, sort_order) VALUES
('1', 'Permanent Make-up', 1),
('2', 'Nachbehandlungen', 2),
('3', 'Wimpernverlängerung', 3),
('4', 'Gesichtsbehandlung', 4),
('5', 'Zusätzliche Leistungen', 5)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

-- Dienstleistungen einfügen
INSERT INTO services (id, title, description, duration, price, category_id, sort_order) VALUES
-- Permanent Make-up
('101', 'POWDERBROWS/OMBRÉ BROWS', 'Powder Brows (Schattierung) durch Permanent Make-up', '120 Min', 249, '1', 1),
('102', 'SENSUAL LIPS (MIT KONTUR)', 'Natürliche Lippenkontur und -schattierung', '120 Min', 259, '1', 2),
('103', 'AQUARELL LIPS', 'Aquarell-Technik für sanft schattierte Lippen', '120 Min', 249, '1', 3),
('104', 'DARK LIPS NEUTRALIZATION', 'Neutralisierung dunkler Lippen', '120 Min', 249, '1', 4),

-- Nachbehandlungen
('201', 'ERSTE NACHARBEIT', 'Erste Auffrischung des Permanent Make-ups innerhalb von 6 Wochen', '120 Min', 69, '2', 1),
('202', 'ZWEITE NACHARBEIT', 'Zweite Auffrischung des Permanent Make-ups innerhalb von 6 Wochen', '90 Min', 59, '2', 2),
('203', 'AUFFRISCHUNG INNERHALB VON 18 MONATE', 'Auffrischung des bestehenden Permanent Make-ups', '120 Min', 159, '2', 3),

-- Wimpernverlängerung
('301', 'MEGA VOLUMEN (AB 5D)', 'Mega-Volumen (ab 5D)', '120 Min', 125, '3', 1),
('302', 'LIGHT VOLUMEN (2D-4D)', 'Leichtes Volumen-Finish mit 2-4 Wimpern pro Naturwimper', '120 Min', 115, '3', 2),
('303', '1:1 TECHNIK', 'Klassische Wimpernverlängerung mit natürlichem Effekt', '120 Min', 99, '3', 3),
('304', 'BIS ZU 2 WOCHEN (MEGA VOLUMEN)', 'Auffüllen Mega Volumen bis zu 2 Wochen', '60 Min', 55, '3', 4),
('305', 'BIS ZU 3 WOCHEN (MEGA VOLUMEN)', 'Auffüllen Mega Volumen bis zu 3 Wochen', '75 Min', 65, '3', 5),
('306', 'BIS ZU 4 WOCHEN (MEGA VOLUMEN)', 'Auffüllen Mega Volumen bis zu 4 Wochen', '90 Min', 75, '3', 6),
('307', 'BIS ZU 2 WOCHEN (LIGHT VOLUMEN)', 'Auffüllen Light Volumen bis zu 2 Wochen', '60 Min', 50, '3', 7),
('308', 'BIS ZU 3 WOCHEN (LIGHT VOLUMEN)', 'Auffüllen Light Volumen bis zu 3 Wochen', '75 Min', 60, '3', 8),
('309', 'BIS ZU 4 WOCHEN (LIGHT VOLUMEN)', 'Auffüllen Light Volumen bis zu 4 Wochen', '90 Min', 70, '3', 9),
('310', 'BIS ZU 2 WOCHEN (1:1 TECHNIK)', 'Auffüllen 1:1 Technik bis zu 2 Wochen', '60 Min', 45, '3', 10),
('311', 'BIS ZU 3 WOCHEN (1:1 TECHNIK)', 'Auffüllen 1:1 Technik bis zu 3 Wochen', '75 Min', 55, '3', 11),
('312', 'BIS ZU 4 WOCHEN (1:1 TECHNIK)', 'Auffüllen 1:1 Technik bis zu 4 Wochen', '90 Min', 65, '3', 12),

-- Gesichtsbehandlung
('401', 'BROWLIFTING (INKL FÄRBEN)', 'Browlifting mit Färben', '45 Min', 45, '4', 1),
('402', 'MICRONEEDLING', 'Intensive Hautverbesserung durch Microneedling', '45 Min', 69, '4', 2),
('403', 'BB GLOW', 'BB Glow Behandlung', '45 Min', 79, '4', 3),
('404', 'MICRONEEDLING & BB GLOW', 'Kombination aus Microneedling und BB Glow für optimale Ergebnisse', '90 Min', 99, '4', 4),

-- Zusätzliche Leistungen
('501', 'WISPY / WET SET', 'Wispy oder Wet Set Styling', '30 Min', 10, '5', 1),
('502', 'FREMDARBEIT AUFFÜLLEN', 'Auffüllen von Wimpernverlängerungen anderer Studios', '120 Min', 80, '5', 2),
('503', 'WIMPERN ENTFERNEN', 'Professionelles Entfernen von Wimpernverlängerungen', '30 Min', 20, '5', 3)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  category_id = EXCLUDED.category_id,
  sort_order = EXCLUDED.sort_order;

-- Überprüfen Sie, ob die Daten erfolgreich importiert wurden
SELECT COUNT(*) FROM service_categories;
SELECT COUNT(*) FROM services;
