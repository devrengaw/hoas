-- 1. ALTER PROFILES TABLE CHECKS AND COLUMNS
-- Drop old check constraint if it exists to allow vehicle and agency roles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'director', 'executive', 'media', 'client', 'vehicle', 'agency'));

-- Add missing columns to public.profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS objective TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS media_type TEXT;

-- 2. CREATE LOGOS STORAGE BUCKET FOR LOGOS & AVATARS
-- Insert the public logos bucket into storage.buckets if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS Policies for the public logos bucket to allow anyone to select/insert files
DROP POLICY IF EXISTS "Public Logos Select Policy" ON storage.objects;
CREATE POLICY "Public Logos Select Policy" ON storage.objects
    FOR SELECT USING (bucket_id = 'logos');

DROP POLICY IF EXISTS "Public Logos Insert Policy" ON storage.objects;
CREATE POLICY "Public Logos Insert Policy" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'logos');
