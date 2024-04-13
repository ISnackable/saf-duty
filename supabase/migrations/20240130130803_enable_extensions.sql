CREATE extension pg_cron
WITH
  SCHEMA extensions;

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
      'You have a duty on ' || to_char((duty_date::date), 'Day, Mon DD, YYYY') || 'at 8:00 AM.'
    FROM public.rosters
    WHERE duty_date = (current_date + '1 day'::interval)
      AND exists (
        SELECT 1
        FROM public.push_subscriptions
        WHERE push_subscriptions.user_id = rosters.duty_personnel_id
      );
$$
  );
