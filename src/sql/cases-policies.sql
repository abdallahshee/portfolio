alter table case_study enable row level security;

-- Anyone can read case studies
create policy "case_study_public_read"
on case_study
for select
to public
using (true);

-- Only authenticated user can insert
create policy "case_study_auth_insert"
on case_study
for insert
to authenticated
with check (true);

-- Only authenticated user can update
create policy "case_study_auth_update"
on case_study
for update
to authenticated
using (true)
with check (true);

-- Only authenticated user can delete
create policy "case_study_auth_delete"
on case_study
for delete
to authenticated
using (true);