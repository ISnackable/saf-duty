INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5 * 1024 * 1024, ARRAY[
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]) ON CONFLICT (id) DO UPDATE SET name = excluded.name;

CREATE POLICY "Avatar images are accessible to public." ON "storage"."objects" AS permissive
FOR SELECT
TO PUBLIC
USING ((bucket_id = 'avatars'::text));

CREATE POLICY "Authenticated can upload an avatar." ON "storage"."objects" AS permissive
FOR INSERT
TO authenticated
WITH CHECK ((bucket_id = 'avatars'::text));

CREATE POLICY "Authenticated can update their own avatar." ON "storage"."objects"
FOR UPDATE
TO authenticated
USING (auth.uid () = OWNER) WITH CHECK (bucket_id = 'avatars');

CREATE OR REPLACE FUNCTION delete_storage_object(bucket text, OBJECT text) RETURNS void LANGUAGE 'plpgsql' SECURITY DEFINER
SET
  "search_path" TO 'public' AS $$
declare
  project_url text;
  service_role_key text; --  full access needed
begin
  select decrypted_secret into project_url from vault.decrypted_secrets where name = 'SUPABASE_URL';
  select decrypted_secret into service_role_key from vault.decrypted_secrets where name = 'SUPABASE_SERVICE_ROLE_KEY';

  if project_url is null then
    raise exception 'project_url not found in vault.decrypted_secrets';
  end if;

  if service_role_key is null then
    raise exception 'service_role_key not found in vault.decrypted_secrets';
  end if;

  perform net.http_delete(
    url:=project_url||'/storage/v1/object/'||bucket||'/'||object,
    headers:=jsonb_build_object('Authorization', 'Bearer ' || service_role_key)
    );
end;
$$;

-- Create or replace the function 'delete_old_avatar'

CREATE OR REPLACE FUNCTION delete_old_avatar() RETURNS TRIGGER LANGUAGE 'plpgsql' SECURITY DEFINER
SET
  "search_path" TO 'public' AS $$
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
        avatar_name := substring(old.avatar_url from 'avatars\/(.*)\.*$');

        -- Call the public.delete_avatar function and store the result
        perform public.delete_storage_object('avatars', avatar_name);
    END IF;

    -- Return the old record for DELETE operations
    IF tg_op = 'DELETE' THEN
        RETURN old;
    END IF;

    -- Return the new record for other operations
    RETURN new;
END;
$$;

create trigger before_profile_changes
before update or delete on public.profiles
for each row execute function public.delete_old_avatar();
