create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id),
  service_id uuid not null references services(id),
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index bookings_customer_id_idx on bookings(customer_id);
create index bookings_service_id_idx on bookings(service_id);
create index bookings_start_time_idx on bookings(start_time);
create index bookings_status_idx on bookings(status);

create trigger bookings_updated_at
  before update on bookings
  for each row
  execute function update_updated_at_column();

-- Funktion zur Überprüfung von Terminüberschneidungen
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

create trigger check_booking_overlap_trigger
  before insert or update on bookings
  for each row
  execute function check_booking_overlap();
