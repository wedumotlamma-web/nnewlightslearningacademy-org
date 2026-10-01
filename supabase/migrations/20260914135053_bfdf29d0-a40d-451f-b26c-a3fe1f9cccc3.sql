CREATE POLICY "Students and guardians can view their own registration"
ON public.registrations
FOR SELECT
TO authenticated
USING (
  lower(coalesce(student_email, '')) = lower(coalesce(auth.jwt() ->> 'email', '@none'))
  OR lower(coalesce(guardian1_email, '')) = lower(coalesce(auth.jwt() ->> 'email', '@none'))
  OR lower(coalesce(guardian2_email, '')) = lower(coalesce(auth.jwt() ->> 'email', '@none'))
);