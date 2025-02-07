-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID REFERENCES services(id) NOT NULL,
    profile_id UUID REFERENCES profiles(id) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add unique constraint to prevent double bookings
ALTER TABLE bookings 
ADD CONSTRAINT unique_booking_slot 
UNIQUE (booking_date, booking_time, service_id);

-- Add index for faster queries
CREATE INDEX idx_bookings_date_time 
ON bookings(booking_date, booking_time);

-- Add index for profile lookups
CREATE INDEX idx_bookings_profile 
ON bookings(profile_id);

-- Add RLS policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
    FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE id = profile_id
    ));

-- Allow users to create bookings
CREATE POLICY "Users can create bookings" ON bookings
    FOR INSERT
    WITH CHECK (true);

-- Allow users to update their own bookings
CREATE POLICY "Users can update own bookings" ON bookings
    FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE id = profile_id
    ));
