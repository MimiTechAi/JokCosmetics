-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Erstelle customers Tabelle
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Aktualisiere bookings Tabelle
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS customer_id UUID;

-- Füge Fremdschlüssel-Constraint hinzu
ALTER TABLE public.bookings
ADD CONSTRAINT fk_customer
FOREIGN KEY (customer_id)
REFERENCES public.customers(id)
ON DELETE CASCADE;

-- Erstelle Indizes
CREATE INDEX IF NOT EXISTS idx_customers_email 
ON public.customers(email);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id 
ON public.bookings(customer_id);

-- Aktiviere Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Erstelle Policies für customers
CREATE POLICY "Enable read access for all users" ON public.customers
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.customers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Aktualisiere bookings Policies
CREATE POLICY "Enable read access for all users" ON public.bookings
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.bookings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
