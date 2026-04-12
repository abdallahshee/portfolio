-- Drop triggers first before the functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_sign_in ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS on_sync_project_description_trigger ON public.project;
-- drop functions when the related triggers are delete
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_sign_in();
DROP FUNCTION IF EXISTS public.sync_user_on_auth_update();
DROP FUNCTION IF EXISTS public.sync_project_description_to_case_study_overview()

