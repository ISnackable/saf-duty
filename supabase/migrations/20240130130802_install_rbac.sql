SET
  check_function_bodies = OFF;

CREATE TABLE
  "groups" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid (),
    "name" text NOT NULL DEFAULT ''::text,
    "created_at" timestamp WITH TIME ZONE NOT NULL DEFAULT now()
  );

CREATE TABLE
  "group_users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid (),
    "group_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" text NOT NULL DEFAULT ''::text,
    "created_at" timestamp WITH TIME ZONE DEFAULT now()
  );

CREATE UNIQUE INDEX group_pkey ON "groups" USING btree (id);

CREATE UNIQUE INDEX group_users_group_id_idx ON group_users USING btree (group_id, user_id, ROLE);

CREATE UNIQUE INDEX group_users_pkey ON group_users USING btree (id);

ALTER TABLE "groups"
ADD CONSTRAINT "group_pkey" PRIMARY KEY USING INDEX "group_pkey";

ALTER TABLE "group_users"
ADD CONSTRAINT "group_users_pkey" PRIMARY KEY USING INDEX "group_users_pkey";

ALTER TABLE "group_users"
ADD CONSTRAINT "group_users_user_id_key" UNIQUE (user_id);

ALTER TABLE "group_users"
ADD CONSTRAINT "group_users_group_id_fkey" FOREIGN KEY (group_id) REFERENCES "groups" (id) NOT VALID;

ALTER TABLE "group_users" VALIDATE CONSTRAINT "group_users_group_id_fkey";

ALTER TABLE "group_users"
ADD CONSTRAINT "group_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users (id) NOT VALID;

ALTER TABLE "group_users" VALIDATE CONSTRAINT "group_users_user_id_fkey";

CREATE
OR REPLACE FUNCTION db_pre_request () RETURNS void LANGUAGE PLPGSQL SECURITY DEFINER AS $function$
declare groups jsonb;
begin -- get current groups from auth.users
SELECT raw_app_meta_data->'groups'
FROM auth.users into groups
WHERE id = auth.uid();
-- store it in the request object
perform set_config(
  'request.groups'::text,
  groups::text,
  false
  /* applies to transaction if true, session if false */
);
end;
$function$;

CREATE
OR REPLACE FUNCTION get_req_groups () RETURNS JSONB LANGUAGE SQL STABLE AS $function$
SELECT coalesce(current_setting('request.groups', true), '{}')::jsonb $function$;

-- Enable the db_pre_request hook for the authenticator role
ALTER ROLE authenticator
SET
  pgrst.db_pre_request TO 'db_pre_request';

NOTIFY pgrst,
'reload config';

CREATE
OR REPLACE FUNCTION delete_group_users () RETURNS TRIGGER LANGUAGE PLPGSQL AS $function$ BEGIN
DELETE FROM group_users
WHERE id = OLD.id;
RETURN NULL;
END;
$function$;

CREATE
OR REPLACE FUNCTION has_group_role (group_id UUID, group_role text) RETURNS boolean LANGUAGE PLPGSQL SECURITY DEFINER AS $function$
DECLARE retval bool;
BEGIN IF session_user = 'authenticator' THEN if jwt_is_expired() then raise exception 'invalid_jwt' USING HINT = 'JWT is expired or missing';
end if;
SELECT coalesce(raw_app_meta_data->'groups'->'id', null) = to_jsonb(group_id)
  and coalesce(raw_app_meta_data->'groups'->'role', null) = to_jsonb(group_role)
FROM auth.users into retval
WHERE id = auth.uid();
return retval;
ELSE -- not a user session, probably being called from a trigger or something
return true;
END IF;
END;
$function$;

CREATE
OR REPLACE FUNCTION is_group_member (group_id UUID) RETURNS boolean LANGUAGE PLPGSQL SECURITY DEFINER AS $function$
DECLARE retval bool;
BEGIN IF session_user = 'authenticator' THEN if jwt_is_expired() then raise exception 'invalid_jwt' USING HINT = 'JWT is expired or missing';
end if;
SELECT coalesce(raw_app_meta_data->'groups'->'id', null) = to_jsonb(group_id)
FROM auth.users into retval
WHERE id = auth.uid();
return retval;
ELSE return true;
END IF;
END;
$function$;

CREATE
OR REPLACE FUNCTION jwt_has_group_role (group_id UUID, group_role text) RETURNS boolean LANGUAGE PLPGSQL AS $function$
DECLARE retval bool;
BEGIN IF session_user = 'authenticator' THEN if jwt_is_expired() then raise exception 'invalid_jwt' USING HINT = 'JWT is expired or missing';
end if;
SELECT coalesce(
    get_req_groups(),
    auth.jwt()->'app_metadata'->'groups'
  )->'id' = to_jsonb(group_id)
  and coalesce(
    get_req_groups(),
    auth.jwt()->'app_metadata'->'groups'
  )->'role' = to_jsonb(group_role) into retval;
return retval;
ELSE -- not a user session, probably being called from a trigger or something
return true;
END IF;
END;
$function$;

CREATE
OR REPLACE FUNCTION jwt_is_expired () RETURNS boolean LANGUAGE PLPGSQL AS $function$ BEGIN return extract(
    epoch
    FROM now()
  ) > coalesce(auth.jwt()->>'exp', '0')::numeric;
END;
$function$;

CREATE
OR REPLACE FUNCTION jwt_is_group_member (group_id UUID) RETURNS boolean LANGUAGE PLPGSQL AS $function$
DECLARE retval bool;
BEGIN IF session_user = 'authenticator' THEN if jwt_is_expired() then raise exception 'invalid_jwt' USING HINT = 'JWT is expired or missing';
end if;
SELECT coalesce(
    get_req_groups(),
    auth.jwt()->'app_metadata'->'groups' ? group_id::text
  )->'id' = to_jsonb(group_id) into retval;
return retval;
ELSE -- not a user session, probably being called from a trigger or something
return true;
END IF;
END;
$function$;

CREATE
OR REPLACE FUNCTION update_user_roles () RETURNS TRIGGER LANGUAGE PLPGSQL SECURITY DEFINER AS $function$
DECLARE _group_id UUID = COALESCE(new.group_id, old.group_id);
_group_id_old UUID = COALESCE(old.group_id, new.group_id);
_user_id UUID = COALESCE(new.user_id, old.user_id);
_user_id_old UUID = COALESCE(old.user_id, new.user_id);
BEGIN -- Check if user_id or group_id is changed
IF _group_id IS DISTINCT
FROM _group_id_old
  OR _user_id IS DISTINCT
FROM _user_id_old THEN RAISE EXCEPTION 'Changing user_id or group_id is not allowed';
END IF;
-- Update raw_app_meta_data in auth.users
UPDATE auth.users
SET raw_app_meta_data = JSONB_SET(
    raw_app_meta_data,
    '{groups}',
    JSONB_STRIP_NULLS(
      JSONB_SET(
        COALESCE(raw_app_meta_data->'groups', '{}'::JSONB),
        '{id}',
        COALESCE(to_jsonb(_group_id), 'null'::JSONB)
      )
    ) || JSONB_STRIP_NULLS(
      JSONB_SET(
        COALESCE(raw_app_meta_data->'groups', '{}'::JSONB),
        '{role}',
        COALESCE(
          (
            SELECT to_jsonb("role")
            FROM group_users gu
            WHERE gu.group_id = _group_id
              AND gu.user_id = _user_id
          ),
          'null'::JSONB
        )
      )
    )
  )
WHERE id = _user_id;
-- Return null (the trigger function requires a return value)
RETURN NULL;
END;
$function$;

CREATE
OR REPLACE FUNCTION set_group_owner () RETURNS TRIGGER LANGUAGE PLPGSQL SECURITY DEFINER AS $function$ begin IF auth.uid() IS not NULL THEN
INSERT INTO group_users(group_id, user_id, role)
VALUES(new.id, auth.uid(), 'owner');
end if;
return new;
end;
$function$;

CREATE
OR REPLACE FUNCTION add_group_user_by_email (user_email text, gid UUID, group_role text) RETURNS text LANGUAGE PLPGSQL SECURITY DEFINER AS $function$
declare uid uuid = auth.uid();
recipient_id uuid;
new_record_id uuid;
BEGIN if uid is null then raise exception 'not_authorized' using hint = 'You are are not authorized to perform this action';
end if;
if not exists(
  SELECT id
  FROM group_users gu
  WHERE gu.user_id = uid
    AND gu.group_id = gid
    AND gu.role = 'owner'
) then raise exception 'not_authorized' using hint = 'You are are not authorized to perform this action';
end if;
SELECT u.id
FROM auth.users u into recipient_id
WHERE u.email = user_email;
if recipient_id is null then raise exception 'failed_to_add_user' using hint = 'User could not be added to group';
end if;
INSERT INTO group_users (group_id, user_id, role)
VALUES (gid, recipient_id, group_role)
returning id into new_record_id;
return new_record_id;
exception
when unique_violation then raise exception 'failed_to_add_user' using hint = 'User could not be added to group';
END;
$function$;

CREATE TRIGGER on_insert_set_group_owner
AFTER INSERT ON groups FOR EACH ROW
EXECUTE FUNCTION set_group_owner ();

ALTER TABLE "group_users" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "groups" ENABLE ROW LEVEL SECURITY;
