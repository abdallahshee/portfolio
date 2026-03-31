-- - ── PROJECT RATING TABLE ──────────────────────────────
ALTER TABLE public.project_rating ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ratings are publicly viewable" ON public.project_rating;
CREATE POLICY "Ratings are publicly viewable"
ON public.project_rating FOR SELECT
TO public
USING (true); -- ✅ needed for AVG/COUNT joins on projects


DROP POLICY IF EXISTS "Users can update their own rating" ON public.project_rating;
CREATE POLICY "Users can update their own rating"
ON public.project_rating FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


DROP POLICY IF EXISTS "Authenticated users can rate" ON public.project_rating;
CREATE POLICY "Authenticated users can rate"
ON public.project_rating FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);