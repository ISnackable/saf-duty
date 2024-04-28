CREATE
OR REPLACE FUNCTION "public"."change_user_password"(current_plain_password varchar, new_plain_password varchar) RETURNS JSON LANGUAGE "plpgsql" SECURITY DEFINER
SET
  "search_path" = "extensions", "public", "auth" AS $$
DECLARE
_uid uuid; -- for checking by 'is not found'
user_id uuid; -- to store the user id from the request
BEGIN
  -- First of all check the new password rules
  -- not empty
  IF (new_plain_password = '') IS NOT FALSE THEN
    RAISE EXCEPTION 'New password is empty';
  -- minimum 6 chars
  ELSIF char_length(new_plain_password) < 6 THEN
    RAISE EXCEPTION 'It must be at least 6 characters in length';
  END IF;

  -- Get user by his current auth.uid and current password
  user_id := auth.uid();
  SELECT id INTO _uid
  FROM auth.users
  WHERE id = user_id
  AND encrypted_password =
  crypt(current_plain_password::text, auth.users.encrypted_password);

  -- Check the currect password
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Your password is incorrect or this account does not exist';
  END IF;

  -- Then update to the new password
  UPDATE auth.users SET
  encrypted_password =
  crypt(new_plain_password, gen_salt('bf'))
  WHERE id = user_id;

  RETURN '{"data":true}';
END;
$$;

CREATE
OR REPLACE FUNCTION "public"."change_user_email"(current_plain_password varchar, new_email varchar) RETURNS JSON LANGUAGE "plpgsql" SECURITY DEFINER
SET
  "search_path" = "extensions", "public", "auth" AS $$
DECLARE
_uid uuid; -- for checking by 'is not found'
user_id uuid; -- to store the user id from the request
BEGIN
  -- Get user by his current auth.uid and current password
  user_id := auth.uid();
  SELECT id INTO _uid
  FROM auth.users
  WHERE id = user_id
  AND encrypted_password =
  crypt(current_plain_password::text, auth.users.encrypted_password);

  -- Check the currect password
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Your password is incorrect or this account does not exist';
  END IF;

  -- Then update to the new password
  UPDATE auth.users SET
  email = new_email
  WHERE id = user_id;

  RETURN '{"data":true}';
END;
$$;

CREATE
OR REPLACE FUNCTION "public"."allow_updating_only" () RETURNS TRIGGER LANGUAGE "plpgsql" AS $$
DECLARE
  whitelist TEXT[] := TG_ARGV::TEXT[];
  schema_table TEXT;
  column_name TEXT;
  rec RECORD;
  new_value TEXT;
  old_value TEXT;
BEGIN
  schema_table := concat(TG_TABLE_SCHEMA, '.', TG_TABLE_NAME);

  -- If RLS is not active on current table for function invoker, early return
  IF NOT row_security_active(schema_table) THEN
    RETURN NEW;
  END IF;

  -- Then check whether the user is an 'admin', early return
  IF (SELECT (public.has_group_role(new.group_id, 'admin'::text))) THEN
    RETURN NEW;
  END IF;

  -- Otherwise, loop on all columns of the table schema
  FOR rec IN (
    SELECT col.column_name
    FROM information_schema.columns as col
    WHERE table_schema = TG_TABLE_SCHEMA
    AND table_name = TG_TABLE_NAME
  ) LOOP
    -- If the current column is whitelisted, early continue
    column_name := rec.column_name;
    IF column_name = ANY(whitelist) THEN
      CONTINUE;
    END IF;

    -- If not whitelisted, execute dynamic SQL to get column value from OLD and NEW records
    EXECUTE format('SELECT ($1).%I, ($2).%I', column_name, column_name)
    INTO new_value, old_value
    USING NEW, OLD;

    -- Raise exception if column value changed
    IF new_value IS DISTINCT FROM old_value THEN
      RAISE EXCEPTION 'Unauthorized change to "%"', column_name;
    END IF;
  END LOOP;

  -- RLS active, but no exception encountered, clear to proceed.
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."allow_updating_only" () OWNER TO "postgres";

CREATE
OR REPLACE FUNCTION "public"."handle_check_user" () RETURNS TRIGGER LANGUAGE "plpgsql" SECURITY DEFINER
SET
  "search_path" TO 'public' AS $$
declare
  new_unit TEXT := new.raw_user_meta_data->>'unit';
begin

if (EXISTS(SELECT 1 FROM public.groups WHERE groups.name=new_unit))
  then return new;
  else return null;
end if;
end;
$$;

ALTER FUNCTION "public"."handle_check_user" () OWNER TO "postgres";

CREATE
OR REPLACE FUNCTION "public"."handle_new_user" () RETURNS TRIGGER LANGUAGE "plpgsql" SECURITY DEFINER
SET
  "search_path" TO 'public' AS $$
declare
  new_unit TEXT := new.raw_user_meta_data->>'unit';
  new_group_id uuid := (SELECT id from public.groups WHERE groups.name=new_unit);
begin
INSERT INTO
  public.profiles (id, email, name, group_id)
VALUES
  (
    new.id,
    new.raw_user_meta_data ->> 'email',
    new.raw_user_meta_data ->> 'name',
    new_group_id
  );

INSERT INTO
  public.group_users (group_id, user_id, role)
VALUES
  (
    new_group_id,
    new.id,
    -- all user by default will have a 'user' role.
    'user'
  );

return new;
end;
$$;

CREATE
OR REPLACE FUNCTION "public"."handle_update_user" () RETURNS TRIGGER LANGUAGE "plpgsql" SECURITY DEFINER
SET
  "search_path" TO 'public' AS $$
begin
  UPDATE public.profiles
  SET email = new.email
  WHERE id = new.id;
  return new;
end;
$$;


CREATE
OR REPLACE FUNCTION "public"."update_rosters_swap_requests" (
  receiver_roster_id BIGINT,
  requester_roster_id BIGINT,
  receiver_id UUID,
  requester_id UUID,
  reserve_receiver_id UUID,
  reserve_requester_id UUID
) RETURNS VOID LANGUAGE "plpgsql" SECURITY DEFINER
SET
  "search_path" TO 'public' AS $$
    BEGIN
      -- Check if the invoker is the receiver, if not raise an exception (auth error)
      -- IF (SELECT auth.uid ()) NOT IN (receiver_id, requester_id) THEN
      --   RAISE EXCEPTION 'Unauthorized to perform this action.';
      -- END IF;

      -- Check if the invoker is the receiver, if not raise an exception (auth error)
      IF (SELECT auth.uid ()) <> receiver_id THEN
        RAISE EXCEPTION 'Unauthorized to perform this action.';
      END IF;

      RAISE LOG 'update_rosters_swap_requests: updating roster for % and  %', receiver_id, requester_id;

    -- Update the receiver's roster with the requester's duty personnel
      UPDATE public.rosters
        SET duty_personnel_id = requester_id,
            reserve_duty_personnel_id = reserve_requester_id,
            updated_at = now()
        WHERE id = receiver_roster_id;

    -- Update the requester's roster with the receiver's duty personnel
      UPDATE public.rosters
        SET duty_personnel_id = receiver_id,
            reserve_duty_personnel_id = reserve_receiver_id,
            updated_at = now()
        WHERE id = requester_roster_id;

    END;
$$;

CREATE
OR REPLACE FUNCTION "public"."handle_rosters_notification" () RETURNS TRIGGER LANGUAGE "plpgsql" SECURITY DEFINER
SET
  "search_path" TO 'public' AS $$
    BEGIN
    -- Insert a new notification for each user who has been assigned a new duty
      INSERT INTO public.notifications (user_id, title, message)
        SELECT
          DISTINCT n.duty_personnel_id,
          'New duty roster published!',
          'You have been assigned a new duty for ' || to_char(MIN(n.duty_date::date), 'Month YYYY')
        FROM new_table n
        WHERE n.duty_personnel_id IN (SELECT user_id FROM public.push_subscriptions)
        GROUP BY n.duty_personnel_id;

  RETURN NULL;
    END;
$$;

ALTER FUNCTION "public"."handle_rosters_notification" () OWNER TO "postgres";

ALTER FUNCTION "public"."handle_new_user" () OWNER TO "postgres";

CREATE
OR REPLACE FUNCTION "public"."validate_swap_request" () RETURNS TRIGGER LANGUAGE "plpgsql" AS $$
DECLARE
  requester_month INTEGER;
  requester_year INTEGER;
  receiver_month INTEGER;
  receiver_year INTEGER;
BEGIN
  -- Extract month and year from requester's roster entry
  SELECT EXTRACT(MONTH FROM duty_date), EXTRACT(YEAR FROM duty_date)
  INTO requester_month, requester_year
  FROM rosters
  WHERE id = NEW.requester_roster_id;

  -- Extract month and year from receiver's roster entry
  SELECT EXTRACT(MONTH FROM duty_date), EXTRACT(YEAR FROM duty_date)
  INTO receiver_month, receiver_year
  FROM rosters
  WHERE id = NEW.receiver_roster_id;

  -- Check if the swap is within the same month
  IF requester_month = receiver_month AND requester_year = receiver_year THEN
    RETURN NEW;
  ELSE
    -- The swap is not within the same month, raise an exception or handle accordingly
    RAISE EXCEPTION 'Swap requests must be in the same month.';
    -- If you want to prevent the swap, you can also use:
    -- RETURN NULL;
  END IF;
END;
$$;

ALTER FUNCTION "public"."validate_swap_request" () OWNER TO "postgres";

SET
  default_tablespace = '';

SET
  default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS
  "public"."notifications" (
    "id" bigint NOT NULL,
    "created_at" timestamp WITH TIME ZONE DEFAULT now() NOT NULL,
    "updated_at" timestamp WITH TIME ZONE DEFAULT now(),
    "user_id" UUID NOT NULL,
    "title" text NOT NULL,
    "message" text NOT NULL,
    "action" public.action NULL,
    "is_read" boolean DEFAULT FALSE NOT NULL
  );

ALTER TABLE "public"."notifications" OWNER TO "postgres";

ALTER TABLE "public"."notifications"
ALTER COLUMN "id"
ADD GENERATED BY DEFAULT AS IDENTITY (
  SEQUENCE NAME "public"."notifications_id_seq" START
  WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
);

CREATE TABLE IF NOT EXISTS
  "public"."profiles" (
    "id" UUID NOT NULL,
    "created_at" timestamp WITH TIME ZONE DEFAULT now() NOT NULL,
    "updated_at" timestamp WITH TIME ZONE DEFAULT now(),
    "email" text unique,
    "name" text NOT NULL,
    "avatar_url" text DEFAULT concat(
      'https://api.dicebear.com/7.x/adventurer/svg?seed=',
      substr(md5((random())::text), 0, 12),
      '&backgroundColor=c0aede'
    ),
    "group_id" UUID NOT NULL,
    "ord_date" date,
    "blockout_dates" date[],
    "max_blockouts" integer DEFAULT 8 NOT NULL,
    "weekday_points" integer DEFAULT 0 NOT NULL,
    "weekend_points" integer DEFAULT 0 NOT NULL,
    "no_of_extras" integer DEFAULT 0,
    "onboarded" boolean DEFAULT FALSE NOT NULL,
    "user_settings" jsonb null default '{"notify_on_duty_reminder": true, "notify_on_swap_requests": true, "notify_on_rosters_published": true}'::jsonb,
    CONSTRAINT "max_blockouts" CHECK ((max_blockouts > 0)),
    CONSTRAINT "name_length" CHECK ((char_length(name) >= 2))
  );

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE OR REPLACE VIEW
  "public"."user_roles"
WITH
  (security_invoker) AS
SELECT
  gu.user_id,
  u.name AS user_name,
  g.name AS group_name,
  gu.role,
  gu.group_id
FROM
  (
    (
      public.group_users gu
      JOIN public.profiles u ON ((u.id = gu.user_id))
    )
    JOIN "public"."groups" g ON ((g.id = gu.group_id))
  );

CREATE TABLE IF NOT EXISTS
  "public"."push_subscriptions" (
    "id" bigint NOT NULL,
    "created_at" timestamp WITH TIME ZONE DEFAULT now() NOT NULL,
    "updated_at" timestamp WITH TIME ZONE DEFAULT now(),
    "user_id" UUID NOT NULL,
    "push_subscription_details" JSONB NOT NULL
  );

ALTER TABLE "public"."push_subscriptions" OWNER TO "postgres";

ALTER TABLE "public"."push_subscriptions"
ALTER COLUMN "id"
ADD GENERATED BY DEFAULT AS IDENTITY (
  SEQUENCE NAME "public"."push_subscriptions_id_seq" START
  WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
);

CREATE TABLE IF NOT EXISTS
  "public"."rosters" (
    "created_at" timestamp WITH TIME ZONE DEFAULT now() NOT NULL,
    "group_id" UUID NOT NULL,
    "is_extra" boolean DEFAULT FALSE NOT NULL,
    "duty_personnel_id" UUID,
    "reserve_duty_personnel_id" UUID,
    "duty_date" date NOT NULL,
    "updated_at" timestamp WITH TIME ZONE DEFAULT now(),
    "id" bigint NOT NULL
  );

ALTER TABLE "public"."rosters" OWNER TO "postgres";

ALTER TABLE "public"."rosters"
ALTER COLUMN "id"
ADD GENERATED BY DEFAULT AS IDENTITY (
  SEQUENCE NAME "public"."rosters_id_seq" START
  WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
);

CREATE TABLE IF NOT EXISTS
  "public"."swap_requests" (
    "id" bigint NOT NULL,
    "created_at" timestamp WITH TIME ZONE DEFAULT now() NOT NULL,
    "updated_at" timestamp WITH TIME ZONE DEFAULT now(),
    "receiver_id" UUID NOT NULL,
    "requester_id" UUID NOT NULL,
    "reason" text,
    "status" public.status DEFAULT 'pending'::public.status NOT NULL,
    "group_id" UUID NOT NULL,
    "receiver_roster_id" bigint NOT NULL,
    "requester_roster_id" bigint NOT NULL
  );

ALTER TABLE "public"."swap_requests" OWNER TO "postgres";

ALTER TABLE "public"."swap_requests"
ALTER COLUMN "id"
ADD GENERATED BY DEFAULT AS IDENTITY (
  SEQUENCE NAME "public"."swap_requests_id_seq" START
  WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
);

ALTER TABLE "public"."profiles"
ADD CONSTRAINT check_user_settings CHECK (
  jsonb_matches_schema(
    '{
      "type": "object",
      "properties": {
         "notify_on_rosters_published": {"type": "boolean"},
         "notify_on_swap_requests": {"type": "boolean"},
          "notify_on_duty_reminder": {"type": "boolean"}
      },
      "required": [
        "notify_on_rosters_published",
        "notify_on_swap_requests",
        "notify_on_duty_reminder"
      ]
    }',
    user_settings
  )
);

ALTER TABLE ONLY "public"."notifications"
ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."push_subscriptions"
ADD CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."push_subscriptions"
ADD CONSTRAINT "push_subscriptions_push_subscription_details_key" UNIQUE ("push_subscription_details");

ALTER TABLE ONLY "public"."push_subscriptions"
ADD CONSTRAINT "push_subscriptions_user_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."rosters"
ADD CONSTRAINT "rosters_duty_date_key" UNIQUE ("duty_date");

ALTER TABLE ONLY "public"."rosters"
ADD CONSTRAINT "rosters_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."swap_requests"
ADD CONSTRAINT "swap_requests_pkey" PRIMARY KEY ("id");

CREATE INDEX IF NOT EXISTS group_users_group_id_idx ON "public"."group_users"(group_id);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON "public"."notifications"(user_id);

CREATE INDEX IF NOT EXISTS profiles_group_id_idx ON "public"."profiles"(group_id);

CREATE INDEX IF NOT EXISTS rosters_multi_idx ON "public"."rosters" USING btree (group_id, duty_personnel_id, reserve_duty_personnel_id);

CREATE INDEX IF NOT EXISTS swap_requests_multi_idx ON "public"."swap_requests" USING btree (group_id, requester_id, receiver_id, receiver_roster_id, requester_roster_id);

CREATE TRIGGER on_after_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user ();

CREATE TRIGGER on_after_auth_user_updated
AFTER UPDATE of email on auth.users FOR EACH ROW
EXECUTE FUNCTION public.handle_update_user ();

CREATE TRIGGER on_before_auth_user_created BEFORE INSERT ON auth.users FOR EACH ROW
EXECUTE FUNCTION public.handle_check_user ();

CREATE TRIGGER on_after_rosters_created
AFTER INSERT ON public.rosters REFERENCING NEW TABLE AS new_table FOR EACH STATEMENT
EXECUTE FUNCTION public.handle_rosters_notification ();

CREATE TRIGGER on_before_swap_request_created BEFORE INSERT ON public.swap_requests FOR EACH ROW
EXECUTE FUNCTION public.validate_swap_request ();

CREATE TRIGGER profile_cls BEFORE INSERT
OR
UPDATE ON public.profiles FOR EACH ROW
EXECUTE FUNCTION public.allow_updating_only (
  'updated_at',
  'name',
  'avatar_url',
  'ord_date',
  'blockout_dates',
  'onboarded',
  'user_settings'
);

CREATE TRIGGER on_change_update_user_metadata
AFTER INSERT
OR
UPDATE ON public.group_users FOR EACH ROW
EXECUTE FUNCTION public.update_user_roles ();

CREATE TRIGGER on_delete_user INSTEAD OF DELETE ON public.user_roles FOR EACH ROW
EXECUTE FUNCTION public.delete_group_users ();

ALTER TABLE ONLY "public"."notifications"
ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
ADD CONSTRAINT "profiles_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.groups (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."push_subscriptions"
ADD CONSTRAINT "push_subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."rosters"
ADD CONSTRAINT "rosters_duty_personnel_id_fkey" FOREIGN KEY (duty_personnel_id) REFERENCES public.profiles (id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."rosters"
ADD CONSTRAINT "rosters_reserve_duty_personnel_id_fkey" FOREIGN KEY (reserve_duty_personnel_id) REFERENCES public.profiles (id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."rosters"
ADD CONSTRAINT "rosters_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.groups (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."swap_requests"
ADD CONSTRAINT "swap_requests_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES public.profiles (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."swap_requests"
ADD CONSTRAINT "swap_requests_receiver_roster_id_fkey" FOREIGN KEY (receiver_roster_id) REFERENCES public.rosters (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."swap_requests"
ADD CONSTRAINT "swap_requests_requester_id_fkey" FOREIGN KEY (requester_id) REFERENCES public.profiles (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."swap_requests"
ADD CONSTRAINT "swap_requests_requester_roster_id_fkey" FOREIGN KEY (requester_roster_id) REFERENCES public.rosters (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."swap_requests"
ADD CONSTRAINT "swap_requests_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.groups (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."group_users"
ADD CONSTRAINT "group_users_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON DELETE CASCADE;

CREATE POLICY "Enable delete for users based on requester_id" ON "public"."swap_requests"
FOR DELETE
TO authenticated
USING ((SELECT auth.uid () = requester_id));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."push_subscriptions"
FOR DELETE
TO authenticated
USING ((SELECT auth.uid () = user_id));

CREATE POLICY "Enable insert for users with 'admin' role" ON "public"."rosters"
FOR INSERT
TO authenticated
WITH
  CHECK ((public.has_group_role (group_id, 'admin'::text)));

CREATE POLICY "Enable insert for users based on requester_id" ON "public"."swap_requests"
FOR INSERT
TO authenticated
WITH
  CHECK ((SELECT auth.uid () = requester_id));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."push_subscriptions"
FOR INSERT
TO authenticated
WITH
  CHECK ((SELECT auth.uid () = user_id));

CREATE POLICY "Enable read for users based on group_id" ON "public"."rosters"
FOR SELECT
TO authenticated
  USING ((public.is_group_member (group_id)));

CREATE POLICY "Enable read for users based on receiver_id or requester_id" ON "public"."swap_requests"
FOR SELECT
TO authenticated
  USING (
    (
      (SELECT auth.uid () = receiver_id)
      OR (SELECT auth.uid () = requester_id)
    )
  );

CREATE POLICY "Enable read for users based on user_id" ON "public"."push_subscriptions"
FOR SELECT
TO authenticated
  USING ((SELECT auth.uid () = user_id));

CREATE POLICY "Enable update for users with 'admin' role" ON "public"."rosters"
FOR UPDATE
TO authenticated
  USING ((public.has_group_role (group_id, 'admin'::text)))
WITH
  CHECK ((public.has_group_role (group_id, 'admin'::text)));

CREATE POLICY "Enable update for users based on group_id" ON "public"."push_subscriptions"
FOR UPDATE
TO authenticated
  USING ((SELECT auth.uid () = user_id));

CREATE POLICY "Enable read for users based on group_id" ON "public"."profiles"
FOR SELECT
TO authenticated
  USING ((public.is_group_member (group_id)));

CREATE POLICY "Enable insert for users based on id or users with 'admin' role" ON "public"."profiles"
FOR INSERT
TO authenticated
WITH
  CHECK (
    (
      (SELECT auth.uid () = id)
      OR (public.has_group_role (group_id, 'admin'::text))
    )
  );

CREATE POLICY "Enable update for users based on id or users with 'admin' role" ON "public"."profiles"
FOR UPDATE
TO authenticated
  USING (
    (
      (SELECT auth.uid () = id)
      OR (public.has_group_role (group_id, 'admin'::text))
    )
  )
WITH
  CHECK (
    (
      (SELECT auth.uid () = id)
      OR (public.has_group_role (group_id, 'admin'::text))
    )
  );

CREATE POLICY "Enable read for users based on their user_id or users with 'admin' role" ON "public"."group_users"
FOR SELECT
TO authenticated
  USING (
    (
      (SELECT auth.uid () = user_id)
      OR public.has_group_role (group_id, 'admin'::text)
    )
  );

CREATE POLICY "Enable update for users based on user_id or users with 'admin' role" ON "public"."group_users"
FOR UPDATE
TO authenticated
  USING ((public.has_group_role (group_id, 'admin'::text)))
WITH
  CHECK ((public.has_group_role (group_id, 'admin'::text)));

CREATE POLICY "Enable all for users based on user_id" ON "public"."notifications"
FOR ALL
TO authenticated
  USING (
    (SELECT auth.uid () = user_id)
  );


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."push_subscriptions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."rosters" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."swap_requests" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public"
FROM
  PUBLIC;

GRANT USAGE ON SCHEMA "public" TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "anon";

GRANT USAGE ON SCHEMA "public" TO "authenticated";

GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."allow_updating_only" () TO "anon";

GRANT ALL ON FUNCTION "public"."allow_updating_only" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."allow_updating_only" () TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_check_user" () TO "anon";

GRANT ALL ON FUNCTION "public"."handle_check_user" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."handle_check_user" () TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user" () TO "anon";

GRANT ALL ON FUNCTION "public"."handle_new_user" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."handle_new_user" () TO "service_role";

GRANT ALL ON FUNCTION "public"."validate_swap_request" () TO "anon";

GRANT ALL ON FUNCTION "public"."validate_swap_request" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."validate_swap_request" () TO "service_role";

GRANT ALL ON TABLE "public"."notifications" TO "anon";

GRANT ALL ON TABLE "public"."notifications" TO "authenticated";

GRANT ALL ON TABLE "public"."notifications" TO "service_role";

GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";

GRANT ALL ON TABLE "public"."profiles" TO "authenticated";

GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."push_subscriptions" TO "anon";

GRANT ALL ON TABLE "public"."push_subscriptions" TO "authenticated";

GRANT ALL ON TABLE "public"."push_subscriptions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."push_subscriptions_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."push_subscriptions_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."push_subscriptions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."rosters" TO "anon";

GRANT ALL ON TABLE "public"."rosters" TO "authenticated";

GRANT ALL ON TABLE "public"."rosters" TO "service_role";

GRANT ALL ON SEQUENCE "public"."rosters_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."rosters_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."rosters_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."swap_requests" TO "anon";

GRANT ALL ON TABLE "public"."swap_requests" TO "authenticated";

GRANT ALL ON TABLE "public"."swap_requests" TO "service_role";

GRANT ALL ON SEQUENCE "public"."swap_requests_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."swap_requests_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."swap_requests_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "service_role";

RESET ALL;
