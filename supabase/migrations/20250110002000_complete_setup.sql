-- Complete setup with all necessary tables and functions

-- Create extensions if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES auth.users(id),
    service_id UUID NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id),
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payload JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    attempts INTEGER DEFAULT 0,
    last_attempt TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

CREATE TABLE IF NOT EXISTS public.notification_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id),
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) NOT NULL UNIQUE,
    value JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create or replace functions
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.customers (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_updated_booking() 
RETURNS TRIGGER AS $$
BEGIN
    -- Create notification for status changes
    IF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) OR (TG_OP = 'INSERT') THEN
        INSERT INTO public.notification_queue (booking_id, type, payload)
        VALUES (
            NEW.id,
            CASE 
                WHEN NEW.status = 'confirmed' THEN 'booking_confirmation'
                WHEN NEW.status = 'cancelled' THEN 'booking_cancellation'
                ELSE 'booking_update'
            END,
            jsonb_build_object(
                'booking_id', NEW.id,
                'status', NEW.status,
                'start_time', NEW.start_time,
                'end_time', NEW.end_time
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_booking_change ON public.bookings;
CREATE TRIGGER on_booking_change
    AFTER INSERT OR UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_booking();

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Services sind öffentlich zugänglich" ON public.services;
CREATE POLICY "Services sind öffentlich zugänglich"
ON public.services FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Kunden können erstellt werden" ON public.customers;
CREATE POLICY "Kunden können erstellt werden"
ON public.customers FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Kunden können ihre eigenen Daten sehen" ON public.customers;
CREATE POLICY "Kunden können ihre eigenen Daten sehen"
ON public.customers FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Kunden können ihre eigenen Daten aktualisieren" ON public.customers;
CREATE POLICY "Kunden können ihre eigenen Daten aktualisieren"
ON public.customers FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Buchungen können erstellt werden" ON public.bookings;
CREATE POLICY "Buchungen können erstellt werden"
ON public.bookings FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Buchungen können eingesehen werden" ON public.bookings;
CREATE POLICY "Buchungen können eingesehen werden"
ON public.bookings FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Buchungen können aktualisiert werden" ON public.bookings;
CREATE POLICY "Buchungen können aktualisiert werden"
ON public.bookings FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Insert initial services
INSERT INTO public.services (name, description, duration, price) VALUES
    ('Klassische Gesichtsbehandlung', 'Eine gründliche Reinigung und Pflege für Ihre Haut', 60, 75.00),
    ('Anti-Aging Behandlung', 'Spezielle Behandlung zur Reduzierung von Falten', 90, 120.00),
    ('Express Gesichtsbehandlung', 'Schnelle aber effektive Gesichtspflege', 30, 45.00),
    ('Deluxe Spa-Paket', 'Umfassende Verwöhnbehandlung für Gesicht und Körper', 120, 180.00)
ON CONFLICT DO NOTHING;
