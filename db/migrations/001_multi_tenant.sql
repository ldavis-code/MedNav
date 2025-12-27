-- Multi-Tenant SaaS Schema Migration
-- Run after base schema.sql in Neon SQL Editor

-- ============================================
-- ORGANIZATIONS (Hospitals / Clinics)
-- ============================================
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,              -- URL subdomain: 'mayo', 'ucsf', 'cleveland-clinic'
    name TEXT NOT NULL,                      -- Display name: 'Mayo Clinic'
    logo_url TEXT,                           -- Custom logo URL
    primary_color TEXT DEFAULT '#1e40af',    -- Brand color (hex)
    secondary_color TEXT DEFAULT '#3b82f6',
    contact_email TEXT,
    website_url TEXT,

    -- Feature flags (JSON for flexibility)
    features JSONB DEFAULT '{
        "price_reports": true,
        "surveys": true,
        "wizard": true,
        "education": true,
        "custom_medications": false,
        "analytics_dashboard": false
    }'::jsonb,

    -- Subscription/billing
    plan TEXT DEFAULT 'free',                -- free, basic, pro, enterprise
    plan_expires_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USERS (Hospital Staff)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    org_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,

    -- Authentication
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,                      -- For email/password auth (optional)
    auth_provider TEXT DEFAULT 'email',      -- email, google, microsoft, saml
    auth_provider_id TEXT,                   -- External ID from OAuth provider

    -- Profile
    name TEXT,
    role TEXT DEFAULT 'viewer',              -- super_admin, org_admin, editor, viewer
    avatar_url TEXT,

    -- Status
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for org-based lookups
CREATE INDEX IF NOT EXISTS idx_users_org_id ON users(org_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- ORGANIZATION MEDICATION CONFIGS
-- ============================================
-- Allows hospitals to customize medication display
CREATE TABLE IF NOT EXISTS org_medication_configs (
    id SERIAL PRIMARY KEY,
    org_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    medication_id TEXT NOT NULL,             -- References medication ID from JSON

    -- Customizations
    display_name TEXT,                       -- Override display name
    custom_notes TEXT,                       -- Hospital-specific notes
    custom_pap_url TEXT,                     -- Custom PAP link
    priority INTEGER DEFAULT 0,              -- Sort order (higher = first)
    is_hidden BOOLEAN DEFAULT false,         -- Hide from this org's view
    is_featured BOOLEAN DEFAULT false,       -- Highlight in search

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(org_id, medication_id)
);

CREATE INDEX IF NOT EXISTS idx_org_med_configs_org
ON org_medication_configs(org_id);

-- ============================================
-- ORGANIZATION CUSTOM RESOURCES
-- ============================================
-- Hospital-specific resources and links
CREATE TABLE IF NOT EXISTS org_resources (
    id SERIAL PRIMARY KEY,
    org_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,

    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    category TEXT,                           -- PAP, Foundation, State Program, Hospital Resource
    icon TEXT,                               -- Lucide icon name
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_org_resources_org
ON org_resources(org_id);

-- ============================================
-- SURVEY RESPONSES (Optional - for hospitals that want data)
-- ============================================
CREATE TABLE IF NOT EXISTS survey_responses (
    id SERIAL PRIMARY KEY,
    org_id INTEGER REFERENCES organizations(id) ON DELETE SET NULL,

    survey_type TEXT NOT NULL,               -- medication, general
    responses JSONB NOT NULL,                -- Full survey response data

    -- Anonymous but trackable
    session_id TEXT,                         -- Browser session ID

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_survey_responses_org
ON survey_responses(org_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_type
ON survey_responses(survey_type);

-- ============================================
-- UPDATE PRICE REPORTS FOR MULTI-TENANCY
-- ============================================
ALTER TABLE price_reports
ADD COLUMN IF NOT EXISTS org_id INTEGER REFERENCES organizations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_price_reports_org
ON price_reports(org_id);

-- ============================================
-- ANALYTICS / AUDIT LOG
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    org_id INTEGER REFERENCES organizations(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,

    event_type TEXT NOT NULL,                -- page_view, search, wizard_complete, etc.
    event_data JSONB,                        -- Event-specific data

    -- Context
    page_path TEXT,
    session_id TEXT,
    user_agent TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_org ON analytics_events(org_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);

-- ============================================
-- API KEYS (for integrations)
-- ============================================
CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    org_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,

    key_hash TEXT UNIQUE NOT NULL,           -- Hashed API key
    name TEXT NOT NULL,                      -- "Production", "Development", etc.
    permissions JSONB DEFAULT '["read"]',    -- read, write, admin

    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_org ON api_keys(org_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
DROP TRIGGER IF EXISTS organizations_updated_at ON organizations;
CREATE TRIGGER organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS org_medication_configs_updated_at ON org_medication_configs;
CREATE TRIGGER org_medication_configs_updated_at
    BEFORE UPDATE ON org_medication_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default "public" organization for non-tenant access
INSERT INTO organizations (slug, name, plan, features)
VALUES (
    'public',
    'Medication Navigator',
    'free',
    '{
        "price_reports": true,
        "surveys": true,
        "wizard": true,
        "education": true,
        "custom_medications": false,
        "analytics_dashboard": false
    }'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- UPDATED VIEW FOR MULTI-TENANT PRICE STATS
-- ============================================
CREATE OR REPLACE VIEW price_report_stats_by_org AS
SELECT
    org_id,
    medication_id,
    source,
    MIN(price) as min_price,
    MAX(price) as max_price,
    ROUND(AVG(price)::numeric, 2) as avg_price,
    COUNT(*) as total_reports,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '90 days') as recent_reports
FROM price_reports
GROUP BY org_id, medication_id, source;
