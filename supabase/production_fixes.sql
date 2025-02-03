-- Erstelle services Tabelle, falls sie noch nicht existiert
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Aktiviere Row Level Security für services, falls noch nicht aktiviert
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'services' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Erstelle Policies für services, falls sie noch nicht existieren
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'services' 
        AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users" ON public.services
            FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'services' 
        AND policyname = 'Enable write access for authenticated users only'
    ) THEN
        CREATE POLICY "Enable write access for authenticated users only" ON public.services
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Aktiviere UUID-Extension falls noch nicht aktiviert
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Erstelle temporäre services Tabelle mit UUID
CREATE TABLE IF NOT EXISTS public.services_new (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Aktiviere Row Level Security für services_new
ALTER TABLE public.services_new ENABLE ROW LEVEL SECURITY;

-- Erstelle Policies für services_new
CREATE POLICY "Enable read access for all users" ON public.services_new
    FOR SELECT USING (true);

CREATE POLICY "Enable write access for authenticated users only" ON public.services_new
    FOR ALL USING (auth.role() = 'authenticated');

-- Füge neue Spalten zur settings Tabelle hinzu
DO $$
BEGIN
    -- Füge business_hours hinzu, falls nicht vorhanden
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'settings' 
        AND column_name = 'business_hours'
    ) THEN
        ALTER TABLE public.settings 
        ADD COLUMN business_hours JSONB DEFAULT '{"start": "09:00", "end": "18:00"}'::jsonb;
    END IF;

    -- Füge break_time hinzu, falls nicht vorhanden
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'settings' 
        AND column_name = 'break_time'
    ) THEN
        ALTER TABLE public.settings 
        ADD COLUMN break_time JSONB DEFAULT '{"start": "12:00", "duration": 60}'::jsonb;
    END IF;

    -- Füge updated_at hinzu, falls nicht vorhanden
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'settings' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.settings 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
    END IF;

    -- Füge setting_key hinzu, falls nicht vorhanden
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'settings' 
        AND column_name = 'setting_key'
    ) THEN
        ALTER TABLE public.settings 
        ADD COLUMN setting_key TEXT;
    END IF;
END $$;

-- Aktiviere Row Level Security für settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Erstelle Policies für settings
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'settings' 
        AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users" ON public.settings
            FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'settings' 
        AND policyname = 'Enable write access for authenticated users only'
    ) THEN
        CREATE POLICY "Enable write access for authenticated users only" ON public.settings
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Erstelle Trigger für updated_at
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'settings_updated_at'
    ) THEN
        CREATE TRIGGER settings_updated_at
            BEFORE UPDATE ON public.settings
            FOR EACH ROW
            EXECUTE FUNCTION update_settings_updated_at();
    END IF;
END $$;

-- Aktualisiere bestehende Einstellungen oder füge neue hinzu
UPDATE public.settings 
SET 
    business_hours = '{"start": "09:00", "end": "18:00"}'::jsonb,
    break_time = '{"start": "12:00", "duration": 60}'::jsonb
WHERE setting_key = 'business_settings';

-- Füge Standardeinstellungen ein, falls keine Einträge vorhanden sind
INSERT INTO public.settings (setting_key, role, business_hours, break_time)
SELECT 
    'business_settings',
    'admin',
    '{"start": "09:00", "end": "18:00"}'::jsonb,
    '{"start": "12:00", "duration": 60}'::jsonb
WHERE NOT EXISTS (
    SELECT 1 FROM public.settings WHERE setting_key = 'business_settings'
);

-- Migriere services und bookings zu UUID
DO $$ 
DECLARE
    service_mapping JSON;
BEGIN
    -- Erstelle temporäre Mapping-Tabelle
    CREATE TEMP TABLE service_id_mapping (
        old_id INTEGER PRIMARY KEY,
        new_id UUID DEFAULT uuid_generate_v4()
    );

    -- Fülle Mapping-Tabelle mit existierenden service_ids
    INSERT INTO service_id_mapping (old_id)
    SELECT DISTINCT service_id::integer 
    FROM public.bookings;

    -- Erstelle neue Services mit UUIDs
    INSERT INTO public.services_new (id, name, duration, price)
    SELECT 
        m.new_id,
        'Service ' || m.old_id,
        60,
        0.00
    FROM service_id_mapping m;

    -- Füge temporäre UUID-Spalte zu bookings hinzu
    ALTER TABLE public.bookings 
    ADD COLUMN service_id_new UUID;

    -- Aktualisiere bookings mit neuen UUIDs
    UPDATE public.bookings b
    SET service_id_new = m.new_id
    FROM service_id_mapping m
    WHERE b.service_id::integer = m.old_id;

    -- Lösche alte services Tabelle und benenne neue um
    DROP TABLE IF EXISTS public.services CASCADE;
    ALTER TABLE public.services_new RENAME TO services;

    -- Aktualisiere bookings Tabelle
    ALTER TABLE public.bookings DROP COLUMN service_id;
    ALTER TABLE public.bookings RENAME COLUMN service_id_new TO service_id;

    -- Füge Foreign Key Constraint hinzu
    ALTER TABLE public.bookings
        ADD CONSTRAINT fk_service
        FOREIGN KEY (service_id)
        REFERENCES public.services(id)
        ON DELETE RESTRICT;
END $$;

-- Füge category-Spalte zur services-Tabelle hinzu
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE public.services ADD COLUMN category TEXT;
    END IF;
END $$;

-- Setze Standardkategorie für bestehende Services
UPDATE public.services 
SET category = 'Allgemein' 
WHERE category IS NULL;
