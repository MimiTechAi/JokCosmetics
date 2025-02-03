-- Erst Daten löschen
DELETE FROM services;
DELETE FROM service_categories;

-- Kategorien einfügen
INSERT INTO service_categories (name, description, sort_order) VALUES
('Permanent Make-up', 'Professionelles Permanent Make-up für einen langanhaltend perfekten Look', 1),
('Wimpern', 'Professionelle Wimpernverlängerung und -styling', 2),
('Gesichtsbehandlung', 'Professionelle Gesichtsbehandlungen und Pflege', 3);

-- Services einfügen
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
    'Erste Auffrischung des Permanent Make-ups',
    'Erste Auffrischung des Permanent Make-ups innerhalb von 6 Wochen',
    '120',
    '65.00',
    1,
    true,
    'erste-auffrischung-pmu'
),
(
    (SELECT id FROM service_categories WHERE name = 'Permanent Make-up'),
    'Powder Brows',
    'Powder Brows (Schattierung) durch Permanent Make-up',
    '120',
    '249.00',
    2,
    true,
    'powder-brows'
),
(
    (SELECT id FROM service_categories WHERE name = 'Permanent Make-up'),
    'Wimpernkranzverdichtung',
    'Professionelle Verdichtung des Wimpernkranzes',
    '90',
    '149.00',
    3,
    true,
    'wimpernkranzverdichtung'
),
(
    (SELECT id FROM service_categories WHERE name = 'Permanent Make-up'),
    'Auffrischung innerhalb von 12 Monate',
    'Auffrischung des bestehenden Permanent Make-ups',
    '120',
    '165.00',
    4,
    true,
    'auffrischung-12-monate'
),
(
    (SELECT id FROM service_categories WHERE name = 'Permanent Make-up'),
    'Lippenkontur und -schattierung',
    'Natürliche Lippenkontur und -schattierung',
    '120',
    '259.00',
    5,
    true,
    'lippenkontur-schattierung'
),
(
    (SELECT id FROM service_categories WHERE name = 'Permanent Make-up'),
    'Zweite Nachbehandlung',
    'Zweite Auffrischung des Permanent Make-ups',
    '90',
    '79.00',
    6,
    true,
    'zweite-nachbehandlung'
),
(
    (SELECT id FROM service_categories WHERE name = 'Permanent Make-up'),
    'Aquarell Lips',
    'Aquarell-Technik für sanft schattierte Lippen',
    '120',
    '249.00',
    7,
    true,
    'aquarell-lips'
),

-- Wimpern Services
(
    (SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Klassische Wimpernverlängerung',
    'Klassische Wimpernverlängerung mit natürlichem Effekt',
    '120',
    '99.00',
    1,
    true,
    'klassische-wimpernverlaengerung'
),
(
    (SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Mega-Volumen',
    'Mega-Volumen (ab 5D)',
    '120',
    '125.00',
    2,
    true,
    'mega-volumen'
),
(
    (SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Nachfüllen',
    'Nachfüllen innerhalb 2 Wochen',
    '90',
    '65.00',
    3,
    true,
    'nachfuellen-2-wochen'
),
(
    (SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Light Volumen',
    'Light Volumen Auffüllen bis zu 2 Wochen',
    '90',
    '55.00',
    4,
    true,
    'light-volumen'
),
(
    (SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Mega Volumen',
    'Mega Volumen Auffüllen bis zu 2 Wochen',
    '90',
    '85.00',
    5,
    true,
    'mega-volumen-auffuellen'
),
(
    (SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Wimpern Lifting',
    'Aufhellen der klassischen Technik',
    '90',
    '45.00',
    6,
    true,
    'wimpern-lifting'
),
(
    (SELECT id FROM service_categories WHERE name = 'Wimpern'),
    'Light Volumen (2D-4D)',
    'Leichtes Volumen-Finish mit 2-4 Wimpern pro Naturwimper',
    '120',
    '115.00',
    7,
    true,
    'light-volumen-2d-4d'
),

-- Gesichtsbehandlung Services
(
    (SELECT id FROM service_categories WHERE name = 'Gesichtsbehandlung'),
    'BB Glow',
    'BB Glow Behandlung',
    '45',
    '79.00',
    1,
    true,
    'bb-glow'
),
(
    (SELECT id FROM service_categories WHERE name = 'Gesichtsbehandlung'),
    'Microneedling',
    'Intensive Hautverbesserung durch Microneedling',
    '45',
    '65.00',
    2,
    true,
    'microneedling'
),
(
    (SELECT id FROM service_categories WHERE name = 'Gesichtsbehandlung'),
    'Microneedling & BB Glow',
    'Kombination aus Microneedling und BB Glow für optimale Ergebnisse',
    '90',
    '99.00',
    3,
    true,
    'microneedling-bb-glow'
);
