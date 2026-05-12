-- Table to store OAuth integrations for meetings (Google, Zoom, Teams)
CREATE TABLE user_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'google', 'zoom', 'microsoft'
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    provider_user_id TEXT, -- User ID in the provider's system
    provider_email TEXT,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id, provider)
);

-- RLS for user_integrations
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own integrations"
ON user_integrations FOR ALL USING (
    profile_id = auth.uid()
);
