-- HOAS Database Schema
-- Multi-tenant architecture using Supabase RLS

-- 1. COMPANIES (Tenants)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE, -- Used for corporate email validation
    logo_url TEXT,
    type TEXT CHECK (type IN ('vehicle', 'agency', 'client')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROFILES (Users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id),
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'director', 'executive', 'media', 'client')),
    email TEXT UNIQUE NOT NULL,
    whatsapp TEXT,
    avatar_url TEXT,
    social_links JSONB DEFAULT '{}',
    interests JSONB DEFAULT '[]', -- For the "FIFA" card (pets, teams, etc.)
    fifa_card_stats JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BRIEFINGS
CREATE TABLE briefings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) NOT NULL,
    creator_id UUID REFERENCES profiles(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_audience TEXT,
    budget NUMERIC,
    timing_start DATE,
    timing_end DATE,
    status TEXT DEFAULT 'draft',
    ai_analysis JSONB DEFAULT '{}', -- Results of IA de Briefing
    confidentiality_level TEXT DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MEETINGS
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) NOT NULL,
    creator_id UUID REFERENCES profiles(id) NOT NULL,
    title TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status TEXT DEFAULT 'scheduled',
    transcript TEXT,
    ai_summary JSONB DEFAULT '{}', -- Results of IA de Reunião
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROJECTS (Marketplace)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    media_type TEXT,
    pricing_model TEXT,
    assets_urls TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. RELATIONSHIPS (Relationship Score)
CREATE TABLE relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_a_id UUID REFERENCES profiles(id) NOT NULL,
    profile_b_id UUID REFERENCES profiles(id) NOT NULL,
    score INTEGER DEFAULT 0,
    last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ai_insights TEXT[],
    UNIQUE(profile_a_id, profile_b_id)
);

-- 7. OPPORTUNITIES (Pipeline)
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) NOT NULL,
    title TEXT NOT NULL,
    value NUMERIC,
    stage TEXT DEFAULT 'lead',
    briefing_id UUID REFERENCES briefings(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. GAMIFICATION
CREATE TABLE gamification (
    profile_id UUID PRIMARY KEY REFERENCES profiles(id),
    coins INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    ranking_position INTEGER,
    achievements JSONB DEFAULT '[]'
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (Example for Profiles)
CREATE POLICY "Profiles are viewable by everyone in the same company" 
ON profiles FOR SELECT USING (
    company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
