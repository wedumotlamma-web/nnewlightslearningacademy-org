CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- First registered account becomes staff + admin
CREATE OR REPLACE FUNCTION public.grant_first_user_staff()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin'), (NEW.id, 'staff');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_staff
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_first_user_staff();

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