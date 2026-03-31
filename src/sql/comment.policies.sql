-- ── COMMENT TABLE ─────────────────────────────────────
ALTER TABLE public.comment ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments are publicly viewable" ON public.comment;
CREATE POLICY "Comments are publicly viewable"
ON public.comment FOR SELECT
TO public
USING (true); -- ✅ needed for COUNT joins on articles

DROP POLICY IF EXISTS "Authenticated users can comment" ON public.comment;
CREATE POLICY "Authenticated users can comment"
ON public.comment FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);


DROP POLICY IF EXISTS "Users can update their own comments" ON public.comment;
CREATE POLICY "Users can update their own comments"
ON public.comment FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comment;
CREATE POLICY "Users can delete their own comments" 
ON Public.comment FOR DELETE
TO authenticated
using (auth.uid()=user_id)
-- WITH CHECK (auth.uid()=user_id)
