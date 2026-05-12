-- Table for global platform statistics
CREATE TABLE IF NOT EXISTS global_stats (
    id TEXT PRIMARY KEY, -- 'hoas_care'
    lives_impacted TEXT DEFAULT '0',
    volunteers TEXT DEFAULT '0',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial record
INSERT INTO global_stats (id, lives_impacted, volunteers) 
VALUES ('hoas_care', '0', '0')
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE global_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Global stats are viewable by everyone" ON global_stats FOR SELECT USING (true);
CREATE POLICY "Only admins can update global stats" ON global_stats FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'platform-admin')
);
