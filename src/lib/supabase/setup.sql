-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Lösche existierende Policies
DROP POLICY IF EXISTS "Services sind öffentlich lesbar" ON services;
DROP POLICY IF EXISTS "Kunden sehen nur eigene Daten" ON customers;
DROP POLICY IF EXISTS "Kunden sehen nur eigene Buchungen" ON bookings;
DROP POLICY IF EXISTS "Kunden sehen nur eigene Benachrichtigungen" ON notifications;

-- Lösche existierende Trigger
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;

-- Lösche existierende Funktionen
DROP FUNCTION IF EXISTS update_updated_at();

-- Lösche existierende Tabellen
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- Erstelle services Tabelle
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  duration INTEGER NOT NULL, -- Dauer in Minuten
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Erstelle reviews Tabelle
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID REFERENCES services(id),
  customer_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Erstelle customers Tabelle
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  whatsapp TEXT,
  preferred_contact TEXT CHECK (preferred_contact IN ('email', 'whatsapp')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Erstelle bookings Tabelle
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  service_id UUID REFERENCES services(id),
  requested_date TIMESTAMPTZ NOT NULL,
  alternate_date TIMESTAMPTZ,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Erstelle notifications Tabelle
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  type TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'sent', 'failed')) DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Erstelle Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für jede Tabelle
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS Policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Services sind für alle lesbar
CREATE POLICY "Services sind öffentlich lesbar"
  ON services FOR SELECT
  TO authenticated, anon
  USING (true);

-- Reviews sind für alle lesbar
CREATE POLICY "Reviews sind öffentlich lesbar"
  ON reviews FOR SELECT
  TO authenticated, anon
  USING (true);

-- Kunden können nur ihre eigenen Daten sehen
CREATE POLICY "Kunden sehen nur eigene Daten"
  ON customers FOR ALL
  TO authenticated
  USING (auth.uid() = id);

-- Buchungen sind nur für den jeweiligen Kunden sichtbar
CREATE POLICY "Kunden sehen nur eigene Buchungen"
  ON bookings FOR ALL
  TO authenticated
  USING (customer_id = auth.uid());

-- Benachrichtigungen sind nur für den jeweiligen Kunden sichtbar
CREATE POLICY "Kunden sehen nur eigene Benachrichtigungen"
  ON notifications FOR SELECT
  TO authenticated
  USING (booking_id IN (
    SELECT id FROM bookings WHERE customer_id = auth.uid()
  ));

-- Initialdaten für Services einfügen
INSERT INTO services (name, description, duration, price, category, image_url) VALUES 
  ('Augenbrauen Powder Brows', 'Powder Brows verleihen Ihren Augenbrauen einen pudrigen, natürlichen Look. Die Technik ist besonders für fettige Haut geeignet.', 180, 350.00, 'Augenbrauen', '/images/services/powder-brows.jpg'),
  ('Augenbrauen Microblading', 'Microblading ist eine manuelle Permanent Make-up-Methode, bei der feinste Härchen gezeichnet werden.', 180, 350.00, 'Augenbrauen', '/images/services/microblading.jpg'),
  ('Augenbrauen Microblading & Powder Brows', 'Kombination aus Microblading und Powder Brows für ein besonders natürliches Ergebnis.', 240, 400.00, 'Augenbrauen', '/images/services/combo-brows.jpg'),
  ('Augenbrauen Nachbehandlung', 'Auffrischung Ihrer Powder Brows oder Microblading innerhalb von 2 Jahren.', 120, 150.00, 'Augenbrauen', '/images/services/brows-refresh.jpg'),
  ('Wimpern Classic', 'Klassische 1:1 Wimpernverlängerung für einen natürlichen Look.', 120, 85.00, 'Wimpern', '/images/services/lashes-classic.jpg'),
  ('Wimpern Volume 2-3D', 'Voluminöse Wimpernverlängerung mit 2-3 Wimpern pro Echthaar.', 150, 95.00, 'Wimpern', '/images/services/lashes-volume.jpg'),
  ('Wimpern Mega Volume 4-6D', 'Dramatischer Look mit 4-6 Wimpern pro Echthaar.', 180, 105.00, 'Wimpern', '/images/services/lashes-mega-volume.jpg'),
  ('Wimpern Refill Classic', 'Auffüllen der klassischen Wimpernverlängerung.', 75, 45.00, 'Wimpern', '/images/services/lashes-refill-classic.jpg'),
  ('Wimpern Refill Volume', 'Auffüllen der Volume Wimpernverlängerung.', 90, 55.00, 'Wimpern', '/images/services/lashes-refill-volume.jpg'),
  ('Wimpern Refill Mega Volume', 'Auffüllen der Mega Volume Wimpernverlängerung.', 120, 65.00, 'Wimpern', '/images/services/lashes-refill-mega.jpg'),
  ('Wimpernlifting inkl. Färben', 'Natürliches Lifting Ihrer eigenen Wimpern, inkl. Färben.', 60, 65.00, 'Wimpern', '/images/services/lash-lift.jpg');

-- Beispiel-Reviews einfügen
INSERT INTO reviews (service_id, customer_name, rating, comment) VALUES 
  ((SELECT id FROM services WHERE name = 'Augenbrauen Powder Brows'), 'Sarah M.', 5, 'Bin super zufrieden mit meinen neuen Augenbrauen! Thansuda ist eine echte Künstlerin.'),
  ((SELECT id FROM services WHERE name = 'Wimpern Classic'), 'Laura K.', 5, 'Sehr professionelle Beratung und ein tolles Ergebnis. Die Wimpern halten super!'),
  ((SELECT id FROM services WHERE name = 'Augenbrauen Microblading'), 'Nina W.', 5, 'Endlich muss ich meine Augenbrauen nicht mehr täglich nachzeichnen. Das Ergebnis ist so natürlich!'),
  ((SELECT id FROM services WHERE name = 'Wimpern Volume 2-3D'), 'Marie S.', 5, 'Die besten Wimpern, die ich je hatte. Sehr sorgfältige Arbeit und tolle Beratung.');
