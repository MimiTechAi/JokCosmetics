-- Insert service categories if they don't exist
INSERT INTO service_categories (name, description) 
VALUES 
    ('Permanent-Make-up', 'Professionelles Permanent Make-up für langanhaltende Schönheit'),
    ('Wimpern', 'Professionelle Wimpernbehandlungen'),
    ('Augenbrauen', 'Professionelle Augenbrauenbehandlungen'),
    ('Gesichtsbehandlung', 'Intensive Gesichtsbehandlungen')
ON CONFLICT (name) DO NOTHING;

-- Insert services
INSERT INTO services (
    category_id,
    title,
    description,
    duration,
    price,
    slug,
    is_active
)
VALUES 
    -- Permanent Make-up
    ((SELECT id FROM service_categories WHERE name = 'Permanent-Make-up'),
    'Erste Auffrischung des Permanent Make-ups',
    'Erste Auffrischung des Permanent Make-ups innerhalb von 6 Wochen',
    '120',
    '65.00',
    'erste-auffrischung-pmu',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Klassische Wimpernverlängerung',
    'Klassische Wimpernverlängerung mit natürlichem Effekt',
    '120',
    '99.00',
    'klassische-wimpernverlaengerung',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Augenbrauen'),
    'Browlifting inkl. Färben',
    'Professionelles Lifting der Augenbrauen inkl. Färben und Keratin-Behandlung',
    '75',
    '45.00',
    'browlifting-faerben',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Permanent-Make-up'),
    'Powder Brows',
    'Powder Brows (Schattierung) durch Permanent Make-up',
    '120',
    '249.00',
    'powder-brows',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Mega-Volumen',
    'Mega-Volumen (ab 5D)',
    '120',
    '125.00',
    'mega-volumen',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Nachfüllen',
    'Nachfüllen innerhalb 2 Wochen',
    '90',
    '65.00',
    'nachfuellen-2-wochen',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Permanent-Make-up'),
    'Wimpernkranzverdichtung',
    'Professionelle Verdichtung des Wimpernkranzes',
    '90',
    '149.00',
    'wimpernkranzverdichtung',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Permanent-Make-up'),
    'Auffrischung innerhalb von 12 Monate',
    'Auffrischung des bestehenden Permanent Make-ups',
    '120',
    '165.00',
    'auffrischung-12-monate',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Light Volumen',
    'Light Volumen Auffüllen bis zu 2 Wochen',
    '90',
    '55.00',
    'light-volumen',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Mega Volumen',
    'Mega Volumen Auffüllen bis zu 2 Wochen',
    '90',
    '85.00',
    'mega-volumen-auffuellen',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Permanent-Make-up'),
    'Lippenkontur und -schattierung',
    'Natürliche Lippenkontur und -schattierung',
    '120',
    '259.00',
    'lippenkontur-schattierung',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Gesichtsbehandlung'),
    'BB Glow',
    'BB Glow Behandlung',
    '90',
    '79.00',
    'bb-glow',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Permanent-Make-up'),
    'Zweite Nachbehandlung',
    'Zweite Auffrischung des Permanent Make-ups',
    '90',
    '79.00',
    'zweite-nachbehandlung',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Permanent-Make-up'),
    'Aquarell Lips',
    'Aquarell-Technik für sanft schattierte Lippen',
    '120',
    '249.00',
    'aquarell-lips',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Wimpern Lifting',
    'Aufhellen der klassischen Technik',
    '90',
    '45.00',
    'wimpern-lifting',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Gesichtsbehandlung'),
    'Microneedling',
    'Intensive Hautverbesserung durch Microneedling Behandlung',
    '45',
    '65.00',
    'microneedling',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Gesichtsbehandlung'),
    'Microneedling & BB Glow',
    'Kombination aus Microneedling und BB Glow für optimale Ergebnisse',
    '90',
    '99.00',
    'microneedling-bb-glow',
    true),

    ((SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Light Volumen (2D-4D)',
    'Leichtes Volumen-Finish mit 2-4 Wimpern pro Naturwimper',
    '120',
    '115.00',
    'light-volumen-2d-4d',
    true)
ON CONFLICT (slug) DO UPDATE 
SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    duration = EXCLUDED.duration,
    price = EXCLUDED.price,
    is_active = EXCLUDED.is_active;
