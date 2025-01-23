-- Drop the existing table
DROP TABLE IF EXISTS admin_users;

-- Create the table with the new schema
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER admin_users_updated_at_trigger
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read admin_users"
    ON admin_users
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow service role to manage admin_users"
    ON admin_users
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Insert the admin user
INSERT INTO admin_users (email)
VALUES ('thansuda22@googlemail.com');
