CREATE TABLE public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  grade TEXT,
  programme TEXT,
  preferred_date DATE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an enquiry"
  ON public.enquiries FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 100
    AND length(email) BETWEEN 3 AND 255
    AND (phone IS NULL OR length(phone) <= 30)
    AND (grade IS NULL OR length(grade) <= 50)
    AND (programme IS NULL OR length(programme) <= 100)
    AND (message IS NULL OR length(message) <= 1000)
  );

CREATE POLICY "Signed-in staff can view enquiries"
  ON public.enquiries FOR SELECT TO authenticated
  USING (true);