-- Erstelle die services Tabelle, falls sie noch nicht existiert
create table if not exists services (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    price decimal(10,2) not null,
    duration integer not null,
    category text not null,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Lösche existierende Services
delete from services;

-- Füge Beispiel-Services ein
insert into services (name, description, price, duration, category, is_active) values
('Klassische Gesichtsbehandlung', 'Eine gründliche Reinigung und Pflege für strahlende Haut', 75.00, 60, 'Gesicht', true),
('Anti-Aging Behandlung', 'Spezielle Behandlung zur Reduzierung von Falten und Hautalterung', 95.00, 75, 'Gesicht', true),
('Rückenmassage', 'Entspannende Massage zur Lösung von Verspannungen', 65.00, 45, 'Massage', true),
('Ganzkörpermassage', 'Wohltuende Massage für den gesamten Körper', 85.00, 60, 'Massage', true),
('Maniküre', 'Professionelle Nagelpflege für gepflegte Hände', 45.00, 45, 'Nägel', true),
('Pediküre', 'Umfassende Fußpflege für gesunde und schöne Füße', 55.00, 50, 'Nägel', true),
('Wimpernlifting', 'Natürliche Wimpernverlängerung für einen ausdrucksstarken Blick', 65.00, 45, 'Augen', true),
('Augenbrauen-Styling', 'Professionelles Formen und Färben der Augenbrauen', 35.00, 30, 'Augen', true);
