-- Table for connections between companies (e.g., Agency <-> Vehicle)
CREATE TABLE IF NOT EXISTS company_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(requester_id, receiver_id)
);

-- RLS Policies
ALTER TABLE company_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's connections"
    ON company_connections FOR SELECT
    USING (
        requester_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()) OR
        receiver_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Users can request connections"
    ON company_connections FOR INSERT
    WITH CHECK (requester_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their company's connections"
    ON company_connections FOR UPDATE
    USING (
        requester_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()) OR
        receiver_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
    );
