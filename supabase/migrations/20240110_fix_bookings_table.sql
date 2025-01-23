-- Erstelle bookings Tabelle neu mit allen benötigten Spalten
DROP TABLE IF EXISTS public.bookings;

CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    customer_email TEXT NOT NULL,
    customer_first_name TEXT NOT NULL,
    customer_last_name TEXT NOT NULL,
    customer_phone TEXT
);

-- Erstelle Indizes
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON public.bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- Aktiviere Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Erstelle Policies
CREATE POLICY "Enable read access for all users" ON public.bookings
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.bookings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.bookings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Füge Constraints hinzu
ALTER TABLE public.bookings
    ADD CONSTRAINT check_end_time_after_start_time 
    CHECK (end_time > start_time);

ALTER TABLE public.bookings
    ADD CONSTRAINT check_status_values 
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));
