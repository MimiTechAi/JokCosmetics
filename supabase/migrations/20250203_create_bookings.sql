-- Drop and recreate bookings table
DROP TABLE IF EXISTS bookings CASCADE;

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES services(id),
    booking_date DATE NOT NULL,
    booking_time VARCHAR(10) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- First disable RLS
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable anonymous booking insertions" ON bookings;
DROP POLICY IF EXISTS "Enable users to view own bookings" ON bookings;
DROP POLICY IF EXISTS "Enable booking insertions for all" ON bookings;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON bookings;
DROP POLICY IF EXISTS "Allow reading own bookings" ON bookings;
DROP POLICY IF EXISTS "public_insert_bookings" ON bookings;
DROP POLICY IF EXISTS "public_select_bookings" ON bookings;

-- Grant necessary permissions to authenticated and anon roles
GRANT ALL ON bookings TO authenticated;
GRANT ALL ON bookings TO anon;
GRANT ALL ON bookings TO service_role;

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create a single policy that allows everything for now
CREATE POLICY "allow_all"
ON bookings
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_bookings_updated_at();
