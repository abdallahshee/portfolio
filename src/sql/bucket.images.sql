-- Anyone can read/view objects in the bucket

create policy "project_images_public_read"
on storage.objects
for select
to public
using (bucket_id = 'project-images');

-- Only authenticated user can upload
create policy "project_images_auth_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'project-images');

-- Only authenticated user can update
create policy "project_images_auth_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'project-images')
with check (bucket_id = 'project-images');

-- Only authenticated user can delete
create policy "project_images_auth_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'project-images');