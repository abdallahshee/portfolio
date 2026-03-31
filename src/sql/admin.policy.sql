DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'user_table', 'article', 'article_like', 'comment',
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
          FROM public.user_table
          WHERE public.user_table.id = auth.uid()
            AND public.user_table.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.user_table
          WHERE public.user_table.id = auth.uid()
            AND public.user_table.role = 'admin'
        )
      )
    $policy$, tbl);
  END LOOP;
END;
$$;