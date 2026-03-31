-- ── ARTICLE LIKE TABLE ────────────────────────────────
-- ALTER TABLE public.article_like ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Likes are publicly viewable" ON public.article_like;
CREATE POLICY "Likes are publicly viewable"
ON public.article_like FOR SELECT
TO public
USING (true); 


DROP POLICY IF EXISTS "Authenticated users can like" ON public.article_like;
CREATE POLICY "Authenticated users can like"
ON public.article_like FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);


DROP POLICY IF EXISTS "Users can unlike their own likes" ON public.article_like;
CREATE POLICY "Users can unlike their own likes"
ON public.article_like FOR DELETE
TO authenticated
USING (auth.uid() = user_id);