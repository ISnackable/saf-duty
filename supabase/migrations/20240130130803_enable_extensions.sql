create extension pg_cron with schema extensions;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

SELECT
  cron.schedule (
    'daily-roster-reminder', -- name of the cron job
    '0 9 * * *', -- Saturday at 3:30am (GMT)
    $$
   INSERT INTO
    public.notifications (user_id, title, message)
      SELECT
        duty_personnel_id, 'Duty reminder!', 'You have a duty on ' || to_char((duty_date::date), 'Day, Mon DD, YYYY') || 'at 8:00 AM.'
      from
        public.rosters
      WHERE
        duty_date = (current_date + '1 day'::interval)
      AND exists (
        SELECT 1 from public.push_subscriptions WHERE push_subscriptions.user_id = rosters.duty_personnel_id
      );
    $$
  );