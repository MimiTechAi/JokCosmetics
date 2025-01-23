-- Erstelle die customers Tabelle (falls noch nicht vorhanden)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Erstelle die bookings Tabelle mit korrekter Fremdschlüsselbeziehung
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    service_id UUID NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT fk_customer
        FOREIGN KEY (customer_id)
        REFERENCES public.customers(id)
        ON DELETE CASCADE
);

-- Erstelle einen Index für die Fremdschlüsselbeziehung
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);

-- Erstelle die notification_queue Tabelle
CREATE TABLE IF NOT EXISTS public.notification_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Füge Policies hinzu für Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;

-- Policies für customers
CREATE POLICY "Enable read access for all users" ON public.customers
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.customers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies für bookings
CREATE POLICY "Enable read access for all users" ON public.bookings
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.bookings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies für notification_queue
CREATE POLICY "Enable read access for all users" ON public.notification_queue
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.notification_queue
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
