
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."role" AS ENUM (
    'user',
    'manager',
    'admin'
);

ALTER TYPE "public"."role" OWNER TO "postgres";

CREATE TYPE "public"."status" AS ENUM (
    'pending',
    'accepted',
    'declined'
);

ALTER TYPE "public"."status" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."allow_updating_only"() RETURNS trigger
    LANGUAGE "plpgsql"
    AS $$
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
  IF (select get_my_claim('role') = '"admin"') THEN
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

ALTER FUNCTION "public"."allow_updating_only"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_claim"(uid uuid, claim text) RETURNS text
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
    BEGIN
      IF NOT is_claims_admin() THEN
          RETURN 'error: access denied';
      ELSE        
        update auth.users set raw_app_meta_data = 
          raw_app_meta_data - claim where id = uid;
        return 'OK';
      END IF;
    END;
$$;

ALTER FUNCTION "public"."delete_claim"(uid uuid, claim text) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_claim"(uid uuid, claim text) RETURNS jsonb
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
    DECLARE retval jsonb;
    BEGIN
      IF NOT is_claims_admin() THEN
          RETURN '{"error":"access denied"}'::jsonb;
      ELSE
        select coalesce(raw_app_meta_data->claim, null) from auth.users into retval where id = uid::uuid;
        return retval;
      END IF;
    END;
$$;

ALTER FUNCTION "public"."get_claim"(uid uuid, claim text) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_claims"(uid uuid) RETURNS jsonb
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
    DECLARE retval jsonb;
    BEGIN
      IF NOT is_claims_admin() THEN
          RETURN '{"error":"access denied"}'::jsonb;
      ELSE
        select raw_app_meta_data from auth.users into retval where id = uid::uuid;
        return retval;
      END IF;
    END;
$$;

ALTER FUNCTION "public"."get_claims"(uid uuid) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_my_claim"(claim text) RETURNS jsonb
    LANGUAGE "sql" STABLE
    AS $$
  select 
  	coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb -> 'app_metadata' -> claim, null)
$$;

ALTER FUNCTION "public"."get_my_claim"(claim text) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_my_claims"() RETURNS jsonb
    LANGUAGE "sql" STABLE
    AS $$
  select 
  	coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb -> 'app_metadata', '{}'::jsonb)::jsonb
$$;

ALTER FUNCTION "public"."get_my_claims"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_check_user"() RETURNS trigger
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  new_unit TEXT := new.raw_user_meta_data->>'unit';
begin

if (EXISTS(SELECT 1 FROM public.units WHERE unit_code=new_unit))
  then return new;
  else return null;
end if;
end;
$$;

ALTER FUNCTION "public"."handle_check_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS trigger
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  new_unit TEXT := new.raw_user_meta_data->>'unit';
  unit_id uuid := (SELECT id from public.units WHERE unit_code=new_unit);
begin
insert into
  public.profiles (id, name, unit_id)
values
  (
    new.id,
    new.raw_user_meta_data ->> 'name',
    unit_id
  );

PERFORM public.set_claim (new.id, 'role', '"user"');

PERFORM public.set_claim (new.id, 'unit_id', to_jsonb(unit_id));
return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_claims_admin"() RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
  BEGIN
    IF session_user = 'authenticator' THEN
      --------------------------------------------
      -- To disallow any authenticated app users
      -- from editing claims, delete the following
      -- block of code and replace it with:
      -- RETURN FALSE;
      --------------------------------------------
      IF extract(epoch from now()) > coalesce((current_setting('request.jwt.claims', true)::jsonb)->>'exp', '0')::numeric THEN
        return false; -- jwt expired
      END IF;
      If current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role' THEN
        RETURN true; -- service role users have admin rights
      END IF;
      IF coalesce((current_setting('request.jwt.claims', true)::jsonb)->'app_metadata'->'claims_admin', 'false')::bool THEN
        return true; -- user has claims_admin set to true
      ELSE
        return false; -- user does NOT have claims_admin set to true
      END IF;
      --------------------------------------------
      -- End of block 
      --------------------------------------------
    ELSE -- not a user session, probably being called from a trigger or something
      return true;
    END IF;
  END;
$$;

ALTER FUNCTION "public"."is_claims_admin"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."set_claim"(uid uuid, claim text, value jsonb) RETURNS text
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
    BEGIN
      IF NOT is_claims_admin() THEN
          RETURN 'error: access denied';
      ELSE        
        update auth.users set raw_app_meta_data = 
          raw_app_meta_data || 
            json_build_object(claim, value)::jsonb where id = uid;
        return 'OK';
      END IF;
    END;
$$;

ALTER FUNCTION "public"."set_claim"(uid uuid, claim text, value jsonb) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."validate_swap_request"() RETURNS trigger
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  requester_month INTEGER;
  requester_year INTEGER;
  receiver_month INTEGER;
  receiver_year INTEGER;
BEGIN
  -- Extract month and year from requester's roster entry
  SELECT EXTRACT(MONTH FROM duty_date), EXTRACT(YEAR FROM duty_date)
  INTO requester_month, requester_year
  FROM roster
  WHERE id = NEW.requester_roster_id;

  -- Extract month and year from receiver's roster entry
  SELECT EXTRACT(MONTH FROM duty_date), EXTRACT(YEAR FROM duty_date)
  INTO receiver_month, receiver_year
  FROM roster
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

ALTER FUNCTION "public"."validate_swap_request"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "user_id" uuid NOT NULL,
    "title" text NOT NULL,
    "message" text NOT NULL,
    "is_read" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."notifications" OWNER TO "postgres";

ALTER TABLE "public"."notifications" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."notifications_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" uuid NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now(),
    "name" text NOT NULL,
    "avatar_url" text DEFAULT concat('https://api.dicebear.com/7.x/adventurer/svg?seed=', substr(md5((random())::text), 0, 12), '&backgroundColor=c0aede'),
    "unit_id" uuid NOT NULL,
    "ord_date" date,
    "blockout_dates" date[],
    "role" public.role DEFAULT 'user'::public.role NOT NULL,
    "max_blockouts" integer DEFAULT 8 NOT NULL,
    "weekday_points" integer DEFAULT 0 NOT NULL,
    "weekend_points" integer DEFAULT 0 NOT NULL,
    "enlistment_date" date,
    "no_of_extras" integer DEFAULT 0,
    "onboarded" boolean DEFAULT false NOT NULL,
    CONSTRAINT "max_blockouts" CHECK ((max_blockouts > 0)),
    CONSTRAINT "name_length" CHECK ((char_length(name) >= 2))
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."push_subscriptions" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now(),
    "user_id" uuid NOT NULL,
    "push_subscription_details" jsonb NOT NULL
);

ALTER TABLE "public"."push_subscriptions" OWNER TO "postgres";

ALTER TABLE "public"."push_subscriptions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."push_subscriptions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."roster" (
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "unit_id" uuid NOT NULL,
    "is_extra" boolean DEFAULT false NOT NULL,
    "duty_personnel" uuid,
    "reserve_duty_personnel" uuid,
    "duty_date" date NOT NULL,
    "updated_at" timestamp with time zone,
    "id" bigint NOT NULL
);

ALTER TABLE "public"."roster" OWNER TO "postgres";

ALTER TABLE "public"."roster" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."roster_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."swap_requests" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone,
    "receiver_id" uuid NOT NULL,
    "requester_id" uuid NOT NULL,
    "reason" text,
    "status" public.status DEFAULT 'pending'::public.status NOT NULL,
    "unit_id" uuid NOT NULL,
    "receiver_roster_id" bigint NOT NULL,
    "requester_roster_id" bigint NOT NULL
);

ALTER TABLE "public"."swap_requests" OWNER TO "postgres";

ALTER TABLE "public"."swap_requests" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."swap_requests_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."units" (
    "id" uuid NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "unit_code" text NOT NULL,
    "updated_at" timestamp with time zone
);

ALTER TABLE "public"."units" ALTER column "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "public"."units" OWNER TO "postgres";

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

ALTER TABLE ONLY "public"."roster"
    ADD CONSTRAINT "roster_duty_date_key" UNIQUE ("duty_date");

ALTER TABLE ONLY "public"."roster"
    ADD CONSTRAINT "roster_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."swap_requests"
    ADD CONSTRAINT "swap_requests_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."units"
    ADD CONSTRAINT "units_pkey" PRIMARY KEY ("id");

ALTER TABLE "storage"."objects" ALTER column "id" SET DEFAULT gen_random_uuid();

CREATE TRIGGER on_after_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_before_auth_user_created BEFORE INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_check_user();

CREATE TRIGGER on_after_notifications_created AFTER INSERT ON public.notifications FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://tscbuvxcsuxlqwcewtgu.supabase.co/functions/v1/push', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzY2J1dnhjc3V4bHF3Y2V3dGd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3OTU3MTUxNCwiZXhwIjoxOTk1MTQ3NTE0fQ.k1W-7WRVRYNey0BUhzWkU6VBLAELeYlvj5Gsjrm_0EI"}', '{}', '1000');

CREATE TRIGGER on_before_swap_request_created BEFORE INSERT ON public.swap_requests FOR EACH ROW EXECUTE FUNCTION public.validate_swap_request();

CREATE TRIGGER profile_cls BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.allow_updating_only('name', 'avatar_url', 'enlistment_date', 'ord_date', 'blockout_dates', 'updated_at', 'onboarded');

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES public.units(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."push_subscriptions"
    ADD CONSTRAINT "push_subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."roster"
    ADD CONSTRAINT "roster_duty_personnel_fkey" FOREIGN KEY (duty_personnel) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."roster"
    ADD CONSTRAINT "roster_reserve_duty_personnel_fkey" FOREIGN KEY (reserve_duty_personnel) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."roster"
    ADD CONSTRAINT "roster_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES public.units(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."swap_requests"
    ADD CONSTRAINT "swap_requests_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."swap_requests"
    ADD CONSTRAINT "swap_requests_receiver_roster_id_fkey" FOREIGN KEY (receiver_roster_id) REFERENCES public.roster(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."swap_requests"
    ADD CONSTRAINT "swap_requests_requester_id_fkey" FOREIGN KEY (requester_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."swap_requests"
    ADD CONSTRAINT "swap_requests_requester_roster_id_fkey" FOREIGN KEY (requester_roster_id) REFERENCES public.roster(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."swap_requests"
    ADD CONSTRAINT "swap_requests_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES public.units(id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Enable delete for users based on requester_id" ON "public"."swap_requests" FOR DELETE USING ((auth.uid() = requester_id));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."push_subscriptions" FOR DELETE USING ((auth.uid() = user_id));

CREATE POLICY "Enable insert for 'admin' role only" ON "public"."roster" FOR INSERT WITH CHECK ((public.get_my_claim('role'::text) = '"admin"'::jsonb));

CREATE POLICY "Enable insert for elevated users only" ON "public"."units" FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Enable insert for users based on requester_id" ON "public"."swap_requests" FOR INSERT WITH CHECK ((auth.uid() = requester_id));

CREATE POLICY "Enable insert for users for self" ON "public"."push_subscriptions" FOR INSERT WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Enable read access for users based on their unit_id" ON "public"."roster" FOR SELECT USING ((unit_id = (( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'unit_id'::text)))::uuid));

CREATE POLICY "Enable read access for users based on their unit_id" ON "public"."units" FOR SELECT USING (((((auth.jwt() -> 'app_metadata'::text) ->> 'unit_id'::text))::uuid = id));

CREATE POLICY "Enable read access for users if they are related" ON "public"."swap_requests" FOR SELECT USING (((auth.uid() = receiver_id) OR (auth.uid() = requester_id)));

CREATE POLICY "Enable read for to self user" ON "public"."push_subscriptions" FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Enable update for 'admin' role only" ON "public"."roster" FOR UPDATE USING ((public.get_my_claim('role'::text) = '"admin"'::jsonb)) WITH CHECK ((public.get_my_claim('role'::text) = '"admin"'::jsonb));

CREATE POLICY "Enable update for users based on self" ON "public"."push_subscriptions" FOR UPDATE USING ((auth.uid() = user_id));

CREATE POLICY "Public profiles are viewable by everyone in the same unit." ON "public"."profiles" FOR SELECT USING ((unit_id = (( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'unit_id'::text)))::uuid));

CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (((auth.uid() = id) OR (public.get_my_claim('role'::text) = '"admin"'::jsonb)));

CREATE POLICY "Users can update own profile or role is admin." ON "public"."profiles" FOR UPDATE USING (((auth.uid() = id) OR (public.get_my_claim('role'::text) = '"admin"'::jsonb))) WITH CHECK (((auth.uid() = id) OR (public.get_my_claim('role'::text) = '"admin"'::jsonb)));

CREATE POLICY "Authenticated can upload an avatar."
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'avatars'::text) AND (auth.role() = 'authenticated'::text)));

CREATE POLICY "Avatar images are accessible to authenticated."
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'avatars'::text) AND (auth.role() = 'authenticated'::text)));

ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."push_subscriptions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."roster" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."swap_requests" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."units" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."allow_updating_only"() TO "anon";
GRANT ALL ON FUNCTION "public"."allow_updating_only"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."allow_updating_only"() TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_claim"(uid uuid, claim text) TO "anon";
GRANT ALL ON FUNCTION "public"."delete_claim"(uid uuid, claim text) TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_claim"(uid uuid, claim text) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_claim"(uid uuid, claim text) TO "anon";
GRANT ALL ON FUNCTION "public"."get_claim"(uid uuid, claim text) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_claim"(uid uuid, claim text) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_claims"(uid uuid) TO "anon";
GRANT ALL ON FUNCTION "public"."get_claims"(uid uuid) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_claims"(uid uuid) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_my_claim"(claim text) TO "anon";
GRANT ALL ON FUNCTION "public"."get_my_claim"(claim text) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_my_claim"(claim text) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_my_claims"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_my_claims"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_my_claims"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_check_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_check_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_check_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."is_claims_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_claims_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_claims_admin"() TO "service_role";

GRANT ALL ON FUNCTION "public"."set_claim"(uid uuid, claim text, value jsonb) TO "anon";
GRANT ALL ON FUNCTION "public"."set_claim"(uid uuid, claim text, value jsonb) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_claim"(uid uuid, claim text, value jsonb) TO "service_role";

GRANT ALL ON FUNCTION "public"."validate_swap_request"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_swap_request"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_swap_request"() TO "service_role";

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

GRANT ALL ON TABLE "public"."roster" TO "anon";
GRANT ALL ON TABLE "public"."roster" TO "authenticated";
GRANT ALL ON TABLE "public"."roster" TO "service_role";

GRANT ALL ON SEQUENCE "public"."roster_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."roster_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."roster_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."swap_requests" TO "anon";
GRANT ALL ON TABLE "public"."swap_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."swap_requests" TO "service_role";

GRANT ALL ON SEQUENCE "public"."swap_requests_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."swap_requests_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."swap_requests_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."units" TO "anon";
GRANT ALL ON TABLE "public"."units" TO "authenticated";
GRANT ALL ON TABLE "public"."units" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
