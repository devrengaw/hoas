-- Add status column to companies for administrative control
ALTER TABLE companies ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'deleted'));

-- Update all existing companies to 'active'
UPDATE companies SET status = 'active' WHERE status IS NULL;
