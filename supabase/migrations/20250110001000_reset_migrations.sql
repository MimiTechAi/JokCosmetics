-- Reset migrations
DROP TABLE IF EXISTS supabase_migrations.schema_migrations;
CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL PRIMARY KEY,
    statements text[],
    name text
);
