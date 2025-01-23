-- Füge customer_id Spalte zur bookings Tabelle hinzu
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS customer_id UUID;

-- Füge Fremdschlüssel-Constraint hinzu
ALTER TABLE public.bookings
ADD CONSTRAINT fk_customer
FOREIGN KEY (customer_id)
REFERENCES public.customers(id)
ON DELETE CASCADE;

-- Erstelle Index für die neue Spalte
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id 
ON public.bookings(customer_id);
