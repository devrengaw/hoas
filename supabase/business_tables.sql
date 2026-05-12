-- New tables for Business logic

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    company_id UUID REFERENCES companies(id),
    type TEXT CHECK (type IN ('in', 'out')),
    amount NUMERIC NOT NULL,
    entity_name TEXT, -- Client or Provider
    campaign_name TEXT,
    status TEXT DEFAULT 'Pendente',
    transaction_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pipeline_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    company_id UUID REFERENCES companies(id),
    title TEXT NOT NULL,
    client_name TEXT,
    value NUMERIC,
    stage TEXT DEFAULT 'lead',
    urgency TEXT DEFAULT 'normal',
    proposal_id UUID, -- Optional link to a proposal
    expected_closing_days INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own pipeline" ON pipeline_deals FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert their own pipeline" ON pipeline_deals FOR INSERT WITH CHECK (auth.uid() = user_id);
