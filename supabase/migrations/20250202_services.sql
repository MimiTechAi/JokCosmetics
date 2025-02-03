-- Drop existing tables if they exist
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS service_categories CASCADE;

-- Create service categories table
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES service_categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    price VARCHAR(50) NOT NULL,
    image_url TEXT,
    benefits TEXT[] DEFAULT '{}',
    features JSONB DEFAULT '[]',
    techniques TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    slug VARCHAR(255) UNIQUE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    video_url TEXT,
    before_after_images TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_categories_updated_at
    BEFORE UPDATE ON service_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_service_categories_is_active ON service_categories(is_active);

-- Insert categories
INSERT INTO service_categories (name, description, sort_order) VALUES
('Permanent Make-up', 'Professionelles Permanent Make-up für einen langanhaltend perfekten Look', 1),
('Wimpern', 'Professionelle Wimpernverlängerung und -styling', 2),
('Gesichtsbehandlung', 'Professionelle Gesichtsbehandlungen und Pflege', 3);

-- Insert services
INSERT INTO services (
    category_id,
    title,
    description,
    duration,
    price,
    sort_order,
    is_active,
    slug
) VALUES
-- Permanent Make-up Services
(
    (SELECT id FROM service_categories WHERE name = 'Permanent Make-up'),
    'Powder Brows',
    'Sanft schattierte Augenbrauen für einen natürlichen Look',
    '120 Min',
    '399€',
    1,
    true,
    'powder-brows'
),
(
    (SELECT id FROM service_categories WHERE name = 'Permanent Make-up'),
    'Permanent Make-up',
    'Professionelles Permanent Make-up',
    '90 Min',
    '249€',
    2,
    true,
    'permanent-makeup'
),
(
    (SELECT id FROM service_categories WHERE name = 'Permanent Make-up'),
    'Permanent Make-up Auffrischung',
    'Auffrischung des bestehenden Permanent Make-up',
    '90 Min',
    '249€',
    3,
    true,
    'permanent-makeup-auffrischung'
),
(
    (SELECT id FROM service_categories WHERE name = 'Permanent Make-up'),
    'Microblading',
    'Präzise Härchentechnik für natürliche Augenbrauen',
    '120 Min',
    '399€',
    4,
    true,
    'microblading'
),

-- Wimpern Services
(
    (SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Wimpernverlängerung',
    'Professionelle Wimpernverlängerung',
    '90 Min',
    '85€',
    1,
    true,
    'wimpernverlaengerung'
),
(
    (SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Wimpern Refill',
    'Auffüllen der Wimpernverlängerung',
    '60 Min',
    '55€',
    2,
    true,
    'wimpern-refill'
),
(
    (SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Wimpern Volume',
    'Voluminöse Wimpernverlängerung',
    '90 Min',
    '95€',
    3,
    true,
    'wimpern-volume'
),
(
    (SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Wimpern Refill Volume',
    'Auffüllen der Volume Wimpern',
    '60 Min',
    '65€',
    4,
    true,
    'wimpern-refill-volume'
),

-- Gesichtsbehandlung Services
(
    (SELECT id FROM service_categories WHERE name = 'Gesichtsbehandlung'),
    'BB Glow',
    'Natürlicher Glow und gleichmäßiger Teint durch BB-Glow-Behandlung',
    '45 Min',
    '75€',
    1,
    true,
    'bb-glow'
),
(
    (SELECT id FROM service_categories WHERE name = 'Gesichtsbehandlung'),
    'Microneedling',
    'Intensive Hautverbesserung durch Microneedling',
    '45 Min',
    '85€',
    2,
    true,
    'microneedling'
),
(
    (SELECT id FROM service_categories WHERE name = 'Gesichtsbehandlung'),
    'Aqua Pure',
    'Tiefenreinigung und Pflege',
    '45 Min',
    '65€',
    3,
    true,
    'aqua-pure'
);
