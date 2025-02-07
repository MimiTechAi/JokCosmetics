-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous insert
CREATE POLICY "Allow anonymous insert" ON contact_messages
    FOR INSERT 
    WITH CHECK (true);

-- Grant necessary permissions
GRANT INSERT ON contact_messages TO anon;
GRANT INSERT ON contact_messages TO authenticated;
