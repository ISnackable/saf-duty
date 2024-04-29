CREATE EXTENSION IF NOT EXISTS "pg_net"
WITH
  SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium"
WITH
  SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"
WITH
  SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto"
WITH
  SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt"
WITH
  SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault"
WITH
  SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
WITH
  SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_jsonschema"
WITH
  SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_cron"
WITH
  SCHEMA "pg_catalog";

GRANT USAGE ON SCHEMA cron TO postgres;

GRANT ALL PRIVILEGES ON ALL TABLES in SCHEMA cron TO postgres;

SELECT
  cron.schedule (
    'daily-roster-reminder', -- name of the cron job
    '0 9 * * *', -- 9:00 AM every day.
    $$
    INSERT INTO public.notifications (user_id, title, message)
    SELECT duty_personnel_id,
      'Duty reminder!',
      'You have a duty on ' || to_char((duty_date::date), 'Day, DD Mon YYYY') || ' at 8:00 AM.'
    FROM public.rosters
    WHERE duty_date = (current_date + '1 day'::interval)
      AND exists (
        SELECT 1
        FROM public.push_subscriptions
        WHERE push_subscriptions.user_id = rosters.duty_personnel_id
      )
      AND (
        SELECT user_settings->>'notify_on_duty_reminder'
        FROM public.profiles
        WHERE profiles.id = rosters.duty_personnel_id
      ) = 'true';
    $$
  );
