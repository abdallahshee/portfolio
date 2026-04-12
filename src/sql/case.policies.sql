-- ✅ Enable RLS
ALTER TABLE case_study ENABLE ROW LEVEL SECURITY;

-- ✅ Anyone can read
DROP POLICY IF EXISTS "case_study_select_policy" ON public.case_study;
CREATE POLICY "case_study_select_policy"
ON case_study
FOR SELECT
USING (true);


-- -- ✅ Only admins can insert
-- DROP POLICY IF EXISTS "case_study_insert_policy" ON public.case_study;
-- CREATE POLICY "case_study_insert_policy"
-- ON case_study
-- FOR INSERT
-- WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM "user"
--     WHERE "user".id = auth.uid()
--     AND "user".role = 'admin'
--   )
-- );


-- -- ✅ Only admins can update
-- DROP POLICY IF EXISTS "case_study_update_policy" ON public.case_study;
-- CREATE POLICY "case_study_update_policy"
-- ON case_study
-- FOR UPDATE
-- USING (
--   EXISTS (
--     SELECT 1 FROM "user"
--     WHERE "user".id = auth.uid()
--     AND "user".role = 'admin'
--   )
-- )
-- WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM "user"
--     WHERE "user".id = auth.uid()
--     AND "user".role = 'admin'
--   )
-- );


-- -- ✅ Only admins can delete
-- DROP POLICY IF EXISTS "case_study_delete_policy" ON public.case_study;
-- CREATE POLICY "case_study_delete_policy"
-- ON case_study
-- FOR DELETE
-- USING (
--   EXISTS (
--     SELECT 1 FROM "user"
--     WHERE "user".id = auth.uid()
--     AND "user".role = 'admin'
--   )
-- );