-- Fix RLS policies to allow Platform Admin and Marketplace visibility

-- 1. COMPANIES POLICIES
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON companies;
CREATE POLICY "Companies are viewable by everyone" 
ON companies FOR SELECT USING (true); -- Marketplace needs this

-- 2. PROFILES POLICIES
DROP POLICY IF EXISTS "Profiles are viewable by everyone in the same company" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Allow users to see profiles in their own company
CREATE POLICY "Profiles are viewable by same company members" 
ON profiles FOR SELECT USING (
    company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
);

-- Allow Platform Admins (role = 'admin') to see all profiles
-- Note: This assumes the 'admin' role in the profile table is the platform admin
CREATE POLICY "Platform Admins can view all profiles" 
ON profiles FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 3. PROJECTS (Marketplace) POLICIES
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON projects;
CREATE POLICY "Projects are viewable by everyone" 
ON projects FOR SELECT USING (true);

-- 4. BRIEFINGS POLICIES
DROP POLICY IF EXISTS "Briefings are viewable by company members" ON briefings;
CREATE POLICY "Briefings are viewable by company members" 
ON briefings FOR SELECT USING (
    company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
);

-- 5. OPPORTUNITIES POLICIES
DROP POLICY IF EXISTS "Opportunities are viewable by company members" ON opportunities;
CREATE POLICY "Opportunities are viewable by company members" 
ON opportunities FOR SELECT USING (
    company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
);
