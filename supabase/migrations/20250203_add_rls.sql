-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access for services" ON services
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access for service categories" ON service_categories
    FOR SELECT
    TO public
    USING (true);

-- Grant necessary permissions
GRANT SELECT ON services TO anon;
GRANT SELECT ON service_categories TO anon;
