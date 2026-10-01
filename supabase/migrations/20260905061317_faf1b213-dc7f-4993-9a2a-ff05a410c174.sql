INSERT INTO public.site_settings (key, value, description) VALUES
  ('homepage_academy_name', 'New-Lights Learning Academy', 'Academy name shown on the website'),
  ('homepage_address', 'Plot 825 Masetlheng Ward, Along Zeerust Road, Tlokweng,
PO Box 45325 Riverwalk, Gaborone, Botswana', 'Physical/postal address, one line per row'),
  ('homepage_phone', '3978977', 'Landline number shown on the website'),
  ('homepage_phone_tel', '+2673978977', 'Landline number in dialable format'),
  ('homepage_whatsapp', '78733300', 'Cell/WhatsApp number shown on the website'),
  ('homepage_email', 'info.newlightsacademy@gmail.com', 'Contact email shown on the website'),
  ('homepage_opening_hours', 'Mon–Fri 08:00–18:00 · Sat 09:00–13:00', 'Opening hours shown in the contact section'),
  ('homepage_tagline', 'Building Strong Foundations For Bright Futures!', 'Tagline shown in the footer')
ON CONFLICT (key) DO NOTHING;