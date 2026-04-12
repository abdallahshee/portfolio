DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'user', 'article', 'article_like', 'comment','case_study',
    'project', 'project_rating', 'category'
  ]
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS "Admins have full access" ON public.%I',
      tbl
    );

    EXECUTE format($policy$
      CREATE POLICY "Admins have full access"
      ON public.%I
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.user
          WHERE public.user.id = auth.uid()
            AND public.user.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.user
          WHERE public.user.id = auth.uid()
            AND public.user.role = 'admin'
        )
      )
    $policy$, tbl);
  END LOOP;
END;
$$;