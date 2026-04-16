alter table project enable row level security;

-- Anyone can read projects
create policy "projects_public_read"
on project
for select
to public
using (true);

-- Only authenticated user can insert
create policy "projects_auth_insert"
on project
for insert
to authenticated
with check (true);

-- Only authenticated user can update
create policy "projects_auth_update"
on project
for update
to authenticated
using (true)
with check (true);

-- Only authenticated user can delete
create policy "projects_auth_delete"
on project
for delete
to authenticated
using (true);