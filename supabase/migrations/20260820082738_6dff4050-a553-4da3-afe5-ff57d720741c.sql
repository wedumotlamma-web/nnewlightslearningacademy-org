DROP POLICY "Staff can view enquiries" ON public.enquiries;
DROP POLICY "Staff can update enquiries" ON public.enquiries;
DROP POLICY "Staff can delete enquiries" ON public.enquiries;

CREATE POLICY "Staff can view enquiries" ON public.enquiries FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'staff'::public.app_role));

CREATE POLICY "Staff can update enquiries" ON public.enquiries FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'staff'::public.app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'staff'::public.app_role));

CREATE POLICY "Staff can delete enquiries" ON public.enquiries FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'staff'::public.app_role));

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;