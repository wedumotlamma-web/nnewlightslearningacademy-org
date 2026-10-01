ALTER TABLE public.enquiries
  ADD COLUMN status text NOT NULL DEFAULT 'new',
  ADD COLUMN staff_notes text;

DROP POLICY IF EXISTS "Signed-in staff can view enquiries" ON public.enquiries;

CREATE POLICY "Staff can view enquiries"
ON public.enquiries FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can update enquiries"
ON public.enquiries FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'staff'))
WITH CHECK (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can delete enquiries"
ON public.enquiries FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'staff'));
