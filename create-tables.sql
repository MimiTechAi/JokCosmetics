-- Tabellen erstellen, falls sie noch nicht existieren
CREATE TABLE IF NOT EXISTS public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id UUID REFERENCES public.service_categories(id),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabelle für Buchungen erstellen, falls sie noch nicht existiert
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS deaktivieren für einfacheren Zugriff während der Entwicklung
ALTER TABLE public.service_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Alternativ: RLS aktivieren mit Richtlinien
-- ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- -- Richtlinien für service_categories
-- CREATE POLICY "Service categories are viewable by everyone" 
-- ON public.service_categories FOR SELECT 
-- USING (true);

-- CREATE POLICY "Service categories are insertable by authenticated users only" 
-- ON public.service_categories FOR INSERT 
-- TO authenticated 
-- WITH CHECK (true);

-- CREATE POLICY "Service categories are updatable by authenticated users only" 
-- ON public.service_categories FOR UPDATE 
-- TO authenticated 
-- USING (true);

-- -- Richtlinien für services
-- CREATE POLICY "Services are viewable by everyone" 
-- ON public.services FOR SELECT 
-- USING (true);

-- CREATE POLICY "Services are insertable by authenticated users only" 
-- ON public.services FOR INSERT 
-- TO authenticated 
-- WITH CHECK (true);

-- CREATE POLICY "Services are updatable by authenticated users only" 
-- ON public.services FOR UPDATE 
-- TO authenticated 
-- USING (true);

-- -- Richtlinien für bookings
-- CREATE POLICY "Bookings are insertable by everyone" 
-- ON public.bookings FOR INSERT 
-- TO anon 
-- WITH CHECK (true);

-- CREATE POLICY "Bookings are viewable by authenticated users only" 
-- ON public.bookings FOR SELECT 
-- TO authenticated 
-- USING (true);

-- CREATE POLICY "Bookings are updatable by authenticated users only" 
-- ON public.bookings FOR UPDATE 
-- TO authenticated 
-- USING (true);

-- Berechtigungen für anonyme Benutzer
GRANT SELECT ON public.service_categories TO anon;
GRANT SELECT ON public.services TO anon;
GRANT INSERT ON public.bookings TO anon;

-- Berechtigungen für authentifizierte Benutzer
GRANT ALL ON public.service_categories TO authenticated;
GRANT ALL ON public.services TO authenticated;
GRANT ALL ON public.bookings TO authenticated;

-- Berechtigungen für Service Role
GRANT ALL ON public.service_categories TO service_role;
GRANT ALL ON public.services TO service_role;
GRANT ALL ON public.bookings TO service_role;
