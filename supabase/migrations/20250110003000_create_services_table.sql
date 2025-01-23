create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  duration integer not null,
  price numeric(10,2) not null,
  is_active boolean default true,
  available_days text[] default array['1','2','3','4','5','6']::text[],
  category text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Beispiel-Services
insert into services (name, description, duration, price, category, image_url) values
('Augenbrauen Lamination', 'Professionelle Augenbrauen-Lamination für definierte Brauen', 60, 49, 'Augenbrauen', '/images/services/brows-refresh.jpg'),
('Wimpern Classic', 'Klassische Wimpernverlängerung für einen natürlichen Look', 90, 79, 'Wimpern', '/images/services/lashes-classic.jpg'),
('Wimpern Volume', 'Volume Wimpernverlängerung für einen dramatischen Look', 120, 99, 'Wimpern', '/images/services/lashes-volume.jpg'),
('Powder Brows', 'Powder Brows für natürlich aussehende, definierte Augenbrauen', 120, 299, 'Permanent Make-up', '/images/services/powder-brows.jpg');

-- Trigger für updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger services_updated_at
  before update on services
  for each row
  execute function update_updated_at_column();
