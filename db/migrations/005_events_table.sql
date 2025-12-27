-- Events Table Migration
-- Tracks user interactions with savings programs (copay cards, foundations, PAPs)

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Event identification
    event_name TEXT NOT NULL,                    -- e.g., 'copay_card_click', 'foundation_click', 'pap_click'

    -- Context
    partner TEXT,                                -- e.g., 'trio', 'methodist' (nullable for public site)
    page_source TEXT NOT NULL,                   -- e.g., '/search-meds', '/tacrolimus'

    -- Program details
    program_type TEXT NOT NULL,                  -- 'copay', 'foundation', 'pap'
    program_id TEXT NOT NULL,                    -- e.g., 'healthwell-medication'

    -- Flexibility for future fields
    meta_json JSONB                              -- optional JSON for additional data
);

-- ============================================
-- INDEXES
-- ============================================

-- For querying by event type
CREATE INDEX IF NOT EXISTS idx_events_event_name ON events(event_name);

-- For filtering by partner
CREATE INDEX IF NOT EXISTS idx_events_partner ON events(partner);

-- For filtering by program type
CREATE INDEX IF NOT EXISTS idx_events_program_type ON events(program_type);

-- For time-based queries and analytics
CREATE INDEX IF NOT EXISTS idx_events_ts ON events(ts);

-- Composite index for common query patterns (program analysis)
CREATE INDEX IF NOT EXISTS idx_events_program ON events(program_type, program_id);

-- Composite index for partner analytics
CREATE INDEX IF NOT EXISTS idx_events_partner_ts ON events(partner, ts);
