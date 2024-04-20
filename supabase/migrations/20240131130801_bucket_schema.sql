INSERT INTO storage.buckets (id, name)
VALUES ('avatars', 'avatars')
ON CONFLICT (id) DO UPDATE 
  SET name = excluded.name;

CREATE POLICY "Authenticated can upload an avatar." ON "storage"."objects" AS permissive
FOR
INSERT TO PUBLIC WITH CHECK (((bucket_id = 'avatars'::text)
                              AND (auth.role () = 'authenticated'::text)));


CREATE POLICY "Avatar images are accessible to authenticated." ON "storage"."objects" AS permissive
FOR
SELECT TO PUBLIC USING (((bucket_id = 'avatars'::text)
                         AND (auth.role () = 'authenticated'::text)));


CREATE POLICY "Authenticated can update their own avatar." ON "storage"."objects"
FOR
UPDATE USING (auth.uid () = OWNER) WITH CHECK (bucket_id = 'avatars');

-- USE SUPABASE VAULT?
CREATE OR REPLACE FUNCTION delete_storage_object(bucket text, OBJECT text, OUT status int, OUT content text) RETURNS record LANGUAGE 'plpgsql' SECURITY DEFINER AS $$
declare
  project_url text;
  service_role_key text; --  full access needed
begin
  select decrypted_secret into project_url from vault.decrypted_secrets where name = 'project_url';
  select decrypted_secret into service_role_key from vault.decrypted_secrets where name = 'service_role_key';

  select
      into status, content
           result.status::int, result.content::text
      FROM extensions.http((
    'DELETE',
    project_url||'/storage/v1/object/'||bucket||'/'||object,
    ARRAY[extensions.http_header('authorization','Bearer '||service_role_key)],
    NULL,
    NULL)::extensions.http_request) as result;
end;
$$;


CREATE OR REPLACE FUNCTION delete_avatar(avatar_url text, OUT status int, OUT content text) RETURNS record LANGUAGE 'plpgsql' SECURITY DEFINER AS $$
begin
  select
      into status, content
           result.status, result.content
      from public.delete_storage_object('avatars', avatar_url) as result;
end;
$$;

-- Create or replace the function 'delete_old_avatar'

CREATE OR REPLACE FUNCTION delete_old_avatar() RETURNS TRIGGER LANGUAGE 'plpgsql' SECURITY DEFINER AS $$
DECLARE
    -- Declare variables
    status INT;
    content TEXT;
    avatar_name TEXT;

BEGIN
    -- Check if the old avatar URL is not empty and if the operation is DELETE or avatar URL changed
    IF COALESCE(old.avatar_url, '') <> ''
       AND (tg_op = 'DELETE' OR (old.avatar_url <> new.avatar_url)) THEN

        -- Extract the avatar name from the old avatar URL
        avatar_name := old.avatar_url;

        -- Call the public.delete_avatar function and store the result
        SELECT INTO status, content
               result.status, result.content
        FROM public.delete_avatar(avatar_name) AS result;

        -- Raise a warning if the status is not 200 (OK)
        IF status <> 200 THEN
            RAISE WARNING 'Could not delete avatar: % %', status, content;
        END IF;
    END IF;

    -- Return the old record for DELETE operations
    IF tg_op = 'DELETE' THEN
        RETURN old;
    END IF;

    -- Return the new record for other operations
    RETURN new;

END;
$$;


CREATE OR REPLACE FUNCTION delete_old_profile() RETURNS TRIGGER LANGUAGE 'plpgsql' SECURITY DEFINER AS $$
begin
  delete from public.profiles where id = old.id;
  return old;
end;
$$;


CREATE TRIGGER before_delete_user
BEFORE
DELETE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.delete_old_profile();