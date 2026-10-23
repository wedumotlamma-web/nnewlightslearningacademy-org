-- Seed data placeholder
INSERT INTO public.profiles (id, email, full_name)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo@nnewlightslearningacademy.org', 'Demo User')
ON CONFLICT (id) DO NOTHING;
