-- Lösche existierende Tabellen
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS services CASCADE;

-- Lösche existierende Trigger und Funktionen
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
DROP FUNCTION IF EXISTS update_updated_at();
DROP FUNCTION IF EXISTS create_booking_notification();

-- Lösche existierende Policies
DROP POLICY IF EXISTS "Services sind öffentlich lesbar" ON services;
DROP POLICY IF EXISTS "Kunden können nur ihre eigenen Daten sehen" ON customers;
DROP POLICY IF EXISTS "Kunden sehen nur ihre eigenen Buchungen" ON bookings;

-- Erstelle services Tabelle
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  duration INTEGER NOT NULL, -- Dauer in Minuten
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Erstelle customers Tabelle
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Services sind für alle lesbar
CREATE POLICY "Services sind öffentlich lesbar"
  ON services FOR SELECT
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
