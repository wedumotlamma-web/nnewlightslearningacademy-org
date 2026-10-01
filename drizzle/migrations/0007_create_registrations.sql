CREATE TABLE public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'new',
  staff_notes text,
  student_name text NOT NULL,
  date_of_birth date,
  id_number text,
  grade_level text,
  student_email text,
  student_phone text,
  subjects text[] NOT NULL DEFAULT '{}'::text[],
  special_needs text,
  attendance_mode text,
  guardian1_name text NOT NULL,
  guardian1_id text,
  guardian1_relationship text,
  guardian1_address text,
  guardian1_phone text NOT NULL,
  guardian1_work_phone text,
  guardian1_email text NOT NULL,
  guardian2_name text,
  guardian2_id text,
  guardian2_relationship text,
  guardian2_address text,
  guardian2_phone text,
  guardian2_work_phone text,
  guardian2_email text,
  emergency_name text,
  emergency_relationship text,
  emergency_phone text,
  photo_consent boolean NOT NULL DEFAULT false,
  agreed_terms boolean NOT NULL DEFAULT false
);

CREATE INDEX registrations_created_at_idx ON public.registrations (created_at DESC);

GRANT INSERT ON public.registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrations TO authenticated;
GRANT ALL ON public.registrations TO service_role;

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a registration"
ON public.registrations FOR INSERT TO anon, authenticated
WITH CHECK (
  length(student_name) BETWEEN 1 AND 120
  AND length(guardian1_name) BETWEEN 1 AND 120
  AND length(guardian1_email) BETWEEN 3 AND 255
  AND length(guardian1_phone) BETWEEN 3 AND 30
  AND (special_needs IS NULL OR length(special_needs) <= 1000)
  AND (array_length(subjects, 1) IS NULL OR array_length(subjects, 1) <= 40)
  AND agreed_terms = true
);

CREATE POLICY "Staff can view registrations"
ON public.registrations FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'staff'::app_role));

CREATE POLICY "Staff can update registrations"
ON public.registrations FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'staff'::app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'staff'::app_role));

CREATE POLICY "Staff can delete registrations"
ON public.registrations FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'staff'::app_role));
