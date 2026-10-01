ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS subjects text[] NOT NULL DEFAULT '{}';

DROP POLICY IF EXISTS "Anyone can submit an enquiry" ON public.enquiries;
CREATE POLICY "Anyone can submit an enquiry"
ON public.enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  ((length(full_name) >= 1) AND (length(full_name) <= 100))
  AND ((length(email) >= 3) AND (length(email) <= 255))
  AND ((phone IS NULL) OR (length(phone) <= 30))
  AND ((grade IS NULL) OR (length(grade) <= 50))
  AND ((programme IS NULL) OR (length(programme) <= 100))
  AND ((message IS NULL) OR (length(message) <= 1000))
  AND (array_length(subjects, 1) IS NULL OR array_length(subjects, 1) <= 30)
);