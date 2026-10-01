GRANT SELECT ON public.site_settings TO anon;

CREATE POLICY "Public can read homepage content"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (key LIKE 'homepage\_%');