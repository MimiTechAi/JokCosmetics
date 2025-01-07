-- Aktiviere die pg_cron Erweiterung
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Funktion zum Planen von Erinnerungen
CREATE OR REPLACE FUNCTION schedule_reminder(
  p_booking_id UUID,
  p_reminder_date TIMESTAMPTZ
) RETURNS void AS $$
BEGIN
  -- Erstelle einen neuen Cron-Job für die Erinnerung
  PERFORM cron.schedule(
    'reminder-' || p_booking_id::text,  -- Eindeutiger Job-Name
    p_reminder_date,                    -- Ausführungszeitpunkt
    $$
    -- Führe die Benachrichtigungsfunktion aus
    SELECT send_notification('BOOKING_REMINDER', booking_id)
    FROM bookings
    WHERE id = '$$|| p_booking_id ||$$'::uuid
    AND status = 'confirmed'
    $$
  );
END;
$$ LANGUAGE plpgsql;
