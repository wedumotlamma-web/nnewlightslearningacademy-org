CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read pages" ON public.pages;
CREATE POLICY "Public can read pages" ON public.pages FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins manage pages" ON public.pages;
CREATE POLICY "Admins manage pages" ON public.pages FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

DROP POLICY IF EXISTS "Authenticated read settings" ON public.site_settings;
CREATE POLICY "Authenticated read settings" ON public.site_settings FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

INSERT INTO public.pages (slug, title, content, meta_description) VALUES
  ('home', 'Home', '{"hero_title": "New-Lights Learning Academy", "hero_description": "Tuition, exam preparation and homeschooling support"}', 'Home page'),
  ('about', 'About', '{"title": "About Us"}', 'About page')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.site_settings (key, value, description) VALUES
  ('phone', '3978977', 'Main phone number'),
  ('phone_tel', '+2673978977', 'Phone number with country code'),
  ('email', 'info.newlightsacademy@gmail.com', 'Contact email'),
  ('whatsapp_number', '78733300', 'WhatsApp number'),
  ('address', 'Plot 825 Meng Ward, Zeerust Road, Tlokweng, Botswana', 'Physical address')
ON CONFLICT (key) DO NOTHING;
