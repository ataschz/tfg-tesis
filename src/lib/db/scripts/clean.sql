-- ================================================
-- Drop all objects in the public schema
-- ================================================
DO $$
DECLARE
    r record;
BEGIN
    -- Drop all triggers (excluding constraint triggers, which are handled by table drops)
    FOR r IN (
        SELECT tgname, relname
        FROM pg_trigger
        JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
        JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
        WHERE pg_namespace.nspname = 'public' AND NOT pg_trigger.tgisinternal
    ) LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.tgname) || ' ON ' || quote_ident(r.relname) || ' CASCADE';
    END LOOP;

    -- Drop all enums (custom types defined as enums)
    FOR r IN (
        SELECT typname
        FROM pg_type
        JOIN pg_namespace ON pg_type.typnamespace = pg_namespace.oid
        WHERE pg_namespace.nspname = 'public' AND pg_type.typtype = 'e'
    ) LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
    END LOOP;

    -- Drop all tables in the public schema
    FOR r IN (
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;

    -- Drop all sequences in the public schema
    FOR r IN (
        SELECT sequencename
        FROM pg_sequences
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequencename) || ' CASCADE';
    END LOOP;

    -- Drop all views in the public schema
    FOR r IN (
        SELECT viewname
        FROM pg_views
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP VIEW IF EXISTS ' || quote_ident(r.viewname) || ' CASCADE';
    END LOOP;

    -- Drop all materialized views in the public schema
    FOR r IN (
        SELECT matviewname
        FROM pg_matviews
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP MATERIALIZED VIEW IF EXISTS ' || quote_ident(r.matviewname) || ' CASCADE';
    END LOOP;
END $$;