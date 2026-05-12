-- Update tables for onboarding flow

-- Add onboarding status to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_master BOOLEAN DEFAULT FALSE; -- True for the user who registered the company

-- Add marketplace/directory fields to companies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS media_type TEXT; -- For Vehicles
ALTER TABLE companies ADD COLUMN IF NOT EXISTS reach_estimate TEXT; -- For Vehicles
ALTER TABLE companies ADD COLUMN IF NOT EXISTS specialties TEXT[]; -- For Agencies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE; -- If true, appears in Marketplace/Directory

-- RLS Update: Everyone can view public companies
CREATE POLICY "Public companies are viewable by everyone" 
ON companies FOR SELECT USING (is_public = true OR id = (SELECT company_id FROM profiles WHERE id = auth.uid()));
