-- ── PROJECT TABLE ─────────────────────────────────────
ALTER TABLE public.project ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category ENABLE ROW LEVEL SECURITY;

 DROP POLICY IF EXISTS "Projects are publicly viewable" ON public.project;
 CREATE POLICY "Projects are publicly viewable"
 ON public.project FOR SELECT
 TO public
 USING (true) ;-- ✅ all projects visible to everyone


DROP POLICY IF EXISTS "Categories are publicly viewable" ON public.category;
CREATE POLICY "Categories are publicly viewable"
ON public.category FOR SELECT
TO public
USING (true); -- ✅ needed for joins with articles
