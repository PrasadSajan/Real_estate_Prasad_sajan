-- 1. Create property_types table
CREATE TABLE IF NOT EXISTS property_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- e.g., 'rowhouse'
    label TEXT NOT NULL,       -- e.g., 'Row House'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed property types
INSERT INTO property_types (name, label) VALUES
    ('rowhouse', 'Row House'),
    ('flat', 'Flat'),
    ('plot', 'Plot'),
    ('land', 'Agricultural Land'),
    ('commercial', 'Commercial')
ON CONFLICT (name) DO NOTHING;

-- 2. Add views to properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- 3. Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Security) - Optional but good practice
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public to insert inquiries (Contact Text)
CREATE POLICY "Public can insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Allow admins to view inquiries
CREATE POLICY "Admins can view inquiries" ON inquiries FOR SELECT USING (auth.role() = 'authenticated');
