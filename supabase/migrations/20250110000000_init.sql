-- Enable RLS
alter table customers enable row level security;
alter table services enable row level security;
alter table bookings enable row level security;

-- Create policies
create policy "Enable read access for all users" on services
  for select using (true);

create policy "Enable read access for authenticated users" on customers
  for select using (auth.role() = 'authenticated');

create policy "Enable insert access for all users" on customers
  for insert with check (true);

create policy "Enable update access for authenticated users" on customers
  for update using (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on bookings
  for select using (auth.role() = 'authenticated');

create policy "Enable insert access for all users" on bookings
  for insert with check (true);

create policy "Enable update access for authenticated users" on bookings
  for update using (auth.role() = 'authenticated');

-- Insert example services
insert into services (name, description, duration, price, category, image_url, is_active, available_days)
values 
  ('Augenbrauen Lamination', 'Professionelle Augenbrauen-Lamination für definierte Brauen', 60, 49, 'Augenbrauen', '/images/services/powder-brows.jpg', true, array['1','2','3','4','5','6']),
  ('Wimpern Classic', 'Klassische Wimpernverlängerung für einen natürlichen Look', 90, 79, 'Wimpern', '/images/services/lashes-classic.jpg', true, array['1','2','3','4','5','6']),
  ('Wimpern Volume', 'Volume Wimpernverlängerung für einen dramatischen Look', 120, 99, 'Wimpern', '/images/services/lashes-volume.jpg', true, array['1','2','3','4','5','6']),
  ('Powder Brows', 'Powder Brows für natürlich aussehende, definierte Augenbrauen', 120, 299, 'Permanent Make-up', '/images/services/powder-brows-new.jpg', true, array['1','2','3','4','5','6'])
on conflict (name) do update set
  description = excluded.description,
  duration = excluded.duration,
  price = excluded.price,
  category = excluded.category,
  image_url = excluded.image_url,
  is_active = excluded.is_active,
  available_days = excluded.available_days;
