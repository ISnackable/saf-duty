
CREATE TRIGGER on_after_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER on_before_auth_user_created BEFORE INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_check_user();


alter table "storage"."objects" alter column "id" set default gen_random_uuid();

create policy "Authenticated can upload an avatar."
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'avatars'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Avatar images are accessible to authenticated."
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'avatars'::text) AND (auth.role() = 'authenticated'::text)));




