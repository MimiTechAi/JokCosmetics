-- Create tables
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  newsletter_opt_in boolean default false,
  reminder_opt_in boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
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

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  customer_first_name text not null,
  customer_last_name text not null,
  customer_phone text,
  service_id uuid not null references services(id),
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists bookings_customer_email_idx on bookings(customer_email);
create index if not exists bookings_service_id_idx on bookings(service_id);
create index if not exists bookings_start_time_idx on bookings(start_time);
create index if not exists bookings_status_idx on bookings(status);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger customers_updated_at
  before update on customers
  for each row
  execute function update_updated_at_column();

create trigger services_updated_at
  before update on services
  for each row
  execute function update_updated_at_column();

create trigger bookings_updated_at
  before update on bookings
  for each row
  execute function update_updated_at_column();

-- Create function to check booking overlaps
create or replace function check_booking_overlap()
returns trigger as $$
begin
  if exists (
    select 1 from bookings
    where service_id = new.service_id
    and status != 'cancelled'
    and id != new.id
    and (
      (new.start_time between start_time and end_time)
      or (new.end_time between start_time and end_time)
      or (start_time between new.start_time and new.end_time)
    )
  ) then
    raise exception 'Terminüberschneidung gefunden';
  end if;
  return new;
end;
$$ language plpgsql;

-- Create trigger for booking overlaps
create trigger check_booking_overlap_trigger
  before insert or update on bookings
  for each row
  execute function check_booking_overlap();
