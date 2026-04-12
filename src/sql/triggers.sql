
-- then recreate functions and triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN

 UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data || '{"role": "user"}'::jsonb
  WHERE id = NEW.id;
  -- Insert into your public user table
  INSERT INTO public."user" (
    id,
    email,
    name,
    avatar,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar',
    'user',
    NOW(),
    NOW()
  );

  -- Also stamp the role back onto auth.users metadata securely
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();



CREATE OR REPLACE FUNCTION public.handle_user_sign_in()
RETURNS trigger AS $$
BEGIN
  UPDATE public."user"
  SET last_sign_in_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



CREATE OR REPLACE TRIGGER on_auth_user_sign_in
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at)
  EXECUTE FUNCTION public.handle_user_sign_in();




-- Function that fires on auth.users update
CREATE OR REPLACE FUNCTION public.sync_user_on_auth_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public."user"
    SET
        name = CASE
            WHEN NEW.raw_user_meta_data ? 'name'
            THEN NEW.raw_user_meta_data ->> 'name'
            ELSE name
        END,
        avatar = CASE
            WHEN NEW.raw_user_meta_data ? 'avatar'
            THEN NEW.raw_user_meta_data ->> 'avatar'
            ELSE avatar
        END,
        email = NEW.email
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.sync_project_description_to_case_study()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.description IS DISTINCT FROM OLD.description) THEN
    UPDATE case_study
    SET
      overview = NEW.description,
      updated_at = NOW()
    WHERE project_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_sync_project_description_trigger
  AFTER INSERT OR UPDATE ON project
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_project_description_to_case_study();