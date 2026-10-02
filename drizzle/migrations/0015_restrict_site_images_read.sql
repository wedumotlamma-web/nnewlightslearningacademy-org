DROP POLICY IF EXISTS "Public can read site images" ON storage.objects;

CREATE POLICY "Admins can read site images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'site-images'
  AND EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);