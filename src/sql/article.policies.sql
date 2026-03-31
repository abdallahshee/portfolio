-- ── ARTICLE TABLE ─────────────────────────────────────
ALTER TABLE public.article ENABLE ROW LEVEL SECURITY;

-- 1. anyone (including unauthenticated) can read published articles
ALTER TABLE public.article ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published articles are publicly viewable" ON public.article;
CREATE POLICY "Published articles are publicly viewable"
ON public.article FOR SELECT
TO public
USING (status = 'published');

-- 2. authenticated users can read their own articles (published or not)
DROP POLICY IF EXISTS "Users can view their own articles" ON public.article;
CREATE POLICY "Users can view their own articles"
ON public.article FOR SELECT
TO authenticated
USING (auth.uid() = user_id);


-- 3. authenticated users can insert their own articles
DROP POLICY IF EXISTS "Users can create articles" ON public.article;
CREATE POLICY "Users can create articles"
ON public.article FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);


-- 4. authenticated users can update their own articles
DROP POLICY IF EXISTS "Users can update their own articles" ON public.article;
CREATE POLICY "Users can update their own articles"
ON public.article FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own articles" ON public.article;
CREATE POLICY "Users can delete their own articles"
ON public.article FOR DELETE
TO authenticated
USING (auth.uid() = user_id);