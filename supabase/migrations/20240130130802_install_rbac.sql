create extension if not exists pg_tle;

create extension if not exists "moddatetime" with schema "public" version '1.0';

create table
  "groups" (
    "id" uuid not null default gen_random_uuid (),
    "name" text not null default ''::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
  );

create table
  "group_users" (
    "id" uuid not null default gen_random_uuid (),
    "group_id" uuid not null,
    "user_id" uuid not null,
    "role" public.role  not null default 'user'::public.role,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
  );

create table
  "group_invites" (
    "id" uuid not null default gen_random_uuid (),
    "group_id" uuid not null,
    "role" public.role  not null default 'user'::public.role,
    "invited_by" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid,
    "accepted_at" timestamp with time zone
  );

CREATE UNIQUE INDEX group_pkey ON "groups" USING btree (id);

CREATE UNIQUE INDEX group_users_group_id_idx ON public.group_users USING btree (group_id, user_id, role);

CREATE UNIQUE INDEX group_users_pkey ON public.group_users USING btree (id);

CREATE UNIQUE INDEX group_invites_pkey ON public.group_invites USING btree (id);

alter table "groups"
add constraint "group_pkey" PRIMARY KEY using index "group_pkey";

alter table "group_users"
add constraint "group_users_pkey" PRIMARY KEY using index "group_users_pkey";

alter table "group_users"
add constraint "group_users_group_id_fkey" FOREIGN KEY (group_id) REFERENCES "groups" (id) ON DELETE CASCADE not valid;

alter table "group_users" validate constraint "group_users_group_id_fkey";

alter table "group_users"
add constraint "group_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE not valid;

alter table "group_users" validate constraint "group_users_user_id_fkey";

alter table "group_invites"
add constraint "group_invites_pkey" PRIMARY KEY using index "group_invites_pkey";

alter table "group_invites"
add constraint "group_invites_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES auth.users (id) ON DELETE CASCADE not valid;

alter table "group_invites" validate constraint "group_invites_invited_by_fkey";

alter table "group_invites"
add constraint "group_invites_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES groups (id) ON DELETE CASCADE not valid;

alter table "group_invites" validate constraint "group_invites_group_id_fkey";

alter table "group_invites"
add constraint "group_invites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES auth.users (id) ON DELETE CASCADE not valid;

alter table "group_invites" validate constraint "group_invites_user_id_fkey";

alter table "group_invites" enable row level security;

create
or REPLACE FUNCTION public.db_pre_request () returns void language plpgsql stable security definer
set
  search_path = public as $function$
declare
    groups jsonb;
begin
    -- get current groups from auth.users
    select raw_app_meta_data->'groups' from auth.users into groups where id = auth.uid();
    -- store it in the request object
    perform set_config('request.groups'::text, groups::text, false /* applies to transaction if true, session if false */);
end;
$function$;

create
or replace function public.get_user_claims () returns jsonb language sql stable 
set
  search_path = public as $function$
select coalesce(current_setting('request.groups', true)::jsonb, auth.jwt()->'app_metadata'->'groups')::jsonb
$function$;

create
or replace function public.user_has_group_role (group_id uuid, group_role text) returns boolean language plpgsql stable 
set
  search_path = public as $function$
declare
  auth_role text = auth.role();
  retval bool;
begin
    if auth_role = 'authenticated' then
        if jwt_is_expired() then
            raise exception 'invalid_jwt' using hint = 'jwt is expired or missing';
        end if;
        select coalesce(
            (get_user_claims()->group_id::text->>'role') = group_role,
            false
          ) into retval;
        return retval;
    elsif auth_role = 'anon' then
        return false;
    else -- not a user session, probably being called from a trigger or something
      if session_user = 'postgres' then
        return true;
      else -- such as 'authenticator'
        return false;
      end if;
    end if;
end;
$function$;

create
or replace function public.user_is_group_member (group_id uuid) returns boolean language plpgsql stable 
set
  search_path = public as $function$
declare
  auth_role text = auth.role();
  retval bool;
begin
    if auth_role = 'authenticated' then
        if jwt_is_expired() then
            raise exception 'invalid_jwt' using hint = 'jwt is expired or missing';
        end if;
        select coalesce(get_user_claims() ? group_id::text,
            false
          ) into retval;
        return retval;
    elsif auth_role = 'anon' then
        return false;
    else -- not a user session, probably being called from a trigger or something
      if session_user = 'postgres' then
        return true;
      else -- such as 'authenticator'
        return false;
      end if;
    end if;
end;
$function$;

create
or replace function public.jwt_is_expired () returns boolean language plpgsql stable 
set
  search_path = public as $function$
begin
  return extract(epoch from now()) > coalesce(auth.jwt()->>'exp', '0')::numeric;
end;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_roles()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO public
AS $function$
DECLARE
  _group_id TEXT = COALESCE(new.group_id, old.group_id)::TEXT;
  _group_id_old TEXT = COALESCE(old.group_id, new.group_id)::TEXT;
  _user_id UUID = COALESCE(new.user_id, old.user_id);
  _user_id_old UUID = COALESCE(old.user_id, new.user_id);
  _role TEXT = COALESCE(new.role, old.role);
  _role_old TEXT = COALESCE(old.role, new.role);
  _raw_app_meta_data JSONB;
  _group_name TEXT;
BEGIN
  -- Check if user_id or group_id is changed
  IF _group_id IS DISTINCT FROM _group_id_old OR _user_id IS DISTINCT FROM _user_id_old THEN
      RAISE EXCEPTION 'Changing user_id or group_id is not allowed';
  END IF;

  -- Fetch current raw_app_meta_data
  SELECT raw_app_meta_data INTO _raw_app_meta_data FROM auth.users WHERE id = _user_id;
  _raw_app_meta_data = coalesce(_raw_app_meta_data, '{}'::jsonb);

   -- Fetch group name from the group table
  SELECT name INTO _group_name FROM groups WHERE id = _group_id::uuid;

  -- Check if the record has been deleted or the role has been changed
  IF (TG_OP = 'DELETE') OR (TG_OP = 'UPDATE' AND _role IS DISTINCT FROM _role_old) THEN
    -- Remove role from raw_app_meta_data
    _raw_app_meta_data = jsonb_set(
        _raw_app_meta_data,
        '{groups}',
        jsonb_strip_nulls(
            COALESCE(_raw_app_meta_data->'groups', '{}'::jsonb) ||
            jsonb_build_object(
                _group_id::text,
               jsonb_strip_nulls(
                    jsonb_set(
                        jsonb_set(
                            COALESCE(_raw_app_meta_data->'groups'->(_group_id::text), '{}'::jsonb),
                            '{role}',
                            NULL
                        ),
                        '{name}',
                        NULL
                    )
                )
            )
        )
    );
  END IF;

  -- Check if the record has been inserted or the role has been changed
  IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND _role IS DISTINCT FROM _role_old) THEN
    -- Add role to raw_app_meta_data
    _raw_app_meta_data = jsonb_set(
        _raw_app_meta_data,
        '{groups}',
        COALESCE(_raw_app_meta_data->'groups', '{}'::jsonb) ||
        jsonb_build_object(
          _group_id::text,
          jsonb_set(
            jsonb_set(
                  COALESCE(_raw_app_meta_data->'groups'->(_group_id::text), '{}'::jsonb),
                  '{role}',
                  to_jsonb(_role)
              ),
            '{name}',
            to_jsonb(_group_name)
          )
        )
    );
  END IF;

  -- Update raw_app_meta_data in auth.users
  UPDATE auth.users
  SET raw_app_meta_data = _raw_app_meta_data
  WHERE id = _user_id;

  -- Passthrough new record (the trigger function requires a return value)
  RETURN NEW;
END;
$function$;

-- Enable the db_pre_request hook for the authenticator role
ALTER ROLE authenticator
SET
  pgrst.db_pre_request TO 'db_pre_request';

NOTIFY pgrst,
'reload config';

create trigger handle_updated_at before
update
    on
    public.groups for each row execute function moddatetime('updated_at');

create trigger handle_updated_at before
update
    on
    public.group_users for each row execute function moddatetime('updated_at');

CREATE TRIGGER on_change_update_user_metadata
AFTER INSERT
OR DELETE
OR
UPDATE ON public.group_users FOR EACH ROW
EXECUTE FUNCTION public.update_user_roles ();

alter table "group_users" enable row level security;

alter table "groups" enable row level security;

alter table "group_invites" enable row level security;
