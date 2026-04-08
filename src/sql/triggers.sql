
-- then recreate functions and triggers
DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user (
    id, email, name,image,role
    created_at, updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar_url',
    "user",
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


DROP FUNCTION IF EXISTS public.handle_user_sign_in();
CREATE OR REPLACE FUNCTION public.handle_user_sign_in()
RETURNS trigger AS $$
BEGIN
  UPDATE public.user
  SET last_sign_in_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


DROP TRIGGER IF EXISTS on_auth_user_sign_in ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_sign_in
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at)
  EXECUTE FUNCTION public.handle_user_sign_in();


-- Function that fires on auth.users update
CREATE OR REPLACE FUNCTION sync_user_on_auth_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.user
    SET
        name = CASE
            WHEN NEW.raw_user_meta_data ? 'name'
            THEN NEW.raw_user_meta_data ->> 'name'
            ELSE name
        END,
        image = CASE
            WHEN NEW.raw_user_meta_data ? 'avatar_url'
            THEN NEW.raw_user_meta_data ->> 'avatar_url'
            ELSE image
        END,
        email = NEW.email
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_on_auth_update();