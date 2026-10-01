CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  gender TEXT,
  marital_status TEXT,
  physical_address TEXT,
  roles TEXT[] NOT NULL DEFAULT '{}',
  specified_role TEXT,
  employment_type TEXT NOT NULL DEFAULT 'full_time',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID,
  created_by_name TEXT NOT NULL DEFAULT 'Botlhe Wedu Motlamma',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BWP',
  description TEXT,
  tax_rate_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  tax_included BOOLEAN NOT NULL DEFAULT FALSE,
  effective_from DATE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID,
  created_by_name TEXT NOT NULL DEFAULT 'Botlhe Wedu Motlamma',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BWP',
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  duration_days INTEGER,
  tax_rate_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  tax_included BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID,
  created_by_name TEXT NOT NULL DEFAULT 'Botlhe Wedu Motlamma',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.package_fees (
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  fee_id UUID NOT NULL REFERENCES public.fees(id) ON DELETE CASCADE,
  PRIMARY KEY (package_id, fee_id)
);

CREATE INDEX IF NOT EXISTS idx_fees_active ON public.fees(active);
CREATE INDEX IF NOT EXISTS idx_packages_active ON public.packages(active);
CREATE INDEX IF NOT EXISTS idx_staff_employment_type ON public.staff(employment_type);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fees TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.package_fees TO authenticated;
GRANT SELECT ON public.fees TO anon;
GRANT SELECT ON public.packages TO anon;
GRANT SELECT ON public.package_fees TO anon;
GRANT ALL ON public.staff TO service_role;
GRANT ALL ON public.fees TO service_role;
GRANT ALL ON public.packages TO service_role;
GRANT ALL ON public.package_fees TO service_role;

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage staff" ON public.staff FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE POLICY "Admins manage fees" ON public.fees FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
CREATE POLICY "Anyone can view active fees" ON public.fees FOR SELECT TO anon, authenticated USING (active);

CREATE POLICY "Admins manage packages" ON public.packages FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
CREATE POLICY "Anyone can view active packages" ON public.packages FOR SELECT TO anon, authenticated USING (active);

CREATE POLICY "Admins manage package fees" ON public.package_fees FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
CREATE POLICY "Anyone can view package fees" ON public.package_fees FOR SELECT TO anon, authenticated USING (true);

CREATE TRIGGER staff_set_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER fees_set_updated_at BEFORE UPDATE ON public.fees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER packages_set_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();