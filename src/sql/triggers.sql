create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  -- set default role in user metadata
  update auth.users
  set raw_user_meta_data = raw_user_meta_data || '{"role": "user"}'::jsonb
  where id = new.id;

  insert into public.profile (
    id,
    email,
    first_name,
    last_name,
    role,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'firstname',
    new.raw_user_meta_data ->> 'lastname',
    'user',
    now(),
    now()
  );
  return new;
end;
$$;



create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();