-- Programs Table Migration
-- Lookup table for savings programs referenced by events

-- ============================================
-- PROGRAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS programs (
    program_id TEXT PRIMARY KEY,                 -- e.g., 'healthwell-medication'
    program_type TEXT NOT NULL                   -- 'copay', 'foundation', 'pap'
        CHECK (program_type IN ('copay', 'foundation', 'pap')),
    name TEXT NOT NULL,                          -- display name
    official_url TEXT NOT NULL,                  -- external URL to redirect to
    active BOOLEAN DEFAULT true
);

-- ============================================
-- INDEXES
-- ============================================

-- For filtering by program type
CREATE INDEX IF NOT EXISTS idx_programs_type ON programs(program_type);

-- For filtering active programs
CREATE INDEX IF NOT EXISTS idx_programs_active ON programs(active);

-- ============================================
-- ADD FOREIGN KEY TO EVENTS TABLE
-- ============================================
ALTER TABLE events
ADD CONSTRAINT fk_events_program
FOREIGN KEY (program_id) REFERENCES programs(program_id);
