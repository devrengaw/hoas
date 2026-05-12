-- Add is_test flag to isolate demo data
ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT FALSE;

-- Update RLS or add indices for better filtering
CREATE INDEX IF NOT EXISTS idx_companies_test ON companies(is_test);
CREATE INDEX IF NOT EXISTS idx_profiles_test ON profiles(is_test);
