-- Lösche existierende Daten (optional)
TRUNCATE services CASCADE;

-- Initialdaten für die Services-Tabelle
INSERT INTO services (name, description, duration, price) VALUES 
  ('Powderbrows', 'Natürlich aussehende, gepuderte Augenbrauen mit modernster Technik für einen perfekten Look.', 180, 399.00),
  ('Wimpernverlängerung Classic', 'Klassische Wimpernverlängerung für einen natürlichen, ausdrucksstarken Blick.', 120, 159.00),
  ('Wimpernverlängerung Volume', 'Voluminöse Wimpernverlängerung für einen dramatischen, glamourösen Look.', 150, 189.00),
  ('Microblading', 'Präzise und naturgetreue Augenbrauengestaltung mit feinster Härchentechnik.', 180, 449.00),
  ('Auffrischung Powderbrows', 'Auffrischung Ihrer Powderbrows für ein langanhaltend perfektes Ergebnis.', 120, 199.00);
