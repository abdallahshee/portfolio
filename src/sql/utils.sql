UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object(
  'role', 'admin'
)
WHERE id = '78958be0-6b4c-401f-9a3a-27dba2c916e0';