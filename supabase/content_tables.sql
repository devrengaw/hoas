-- New tables for Global Content Management

CREATE TABLE IF NOT EXISTS global_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    attendees TEXT,
    type TEXT,
    image_url TEXT,
    link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS global_care_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    goal_value NUMERIC,
    current_value NUMERIC DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE global_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_care_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Global events are viewable by everyone" ON global_events FOR SELECT USING (true);
CREATE POLICY "Global care campaigns are viewable by everyone" ON global_care_campaigns FOR SELECT USING (true);
