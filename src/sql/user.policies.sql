-- ── USER TABLE ────────────────────────────────────────
-- ALTER TABLE public.user_table ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are publicly viewable" ON public.user_table;
CREATE POLICY "Profiles are publicly viewable"
ON public.user_table FOR SELECT
TO public
USING (true); -- ✅ everyone can read user profiles for joins to work

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_table;
CREATE POLICY "Users can update their own profile"
ON public.user_table FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);