-- Seed Test Programs Migration
-- Adds test programs for verifying redirect routes

-- ============================================
-- MODIFY EVENTS TABLE FOR FRONT-END EVENTS
-- ============================================

-- Drop the foreign key constraint to allow front-end events without a program
ALTER TABLE events DROP CONSTRAINT IF EXISTS fk_events_program;

-- Make program_type and program_id nullable for front-end events
ALTER TABLE events ALTER COLUMN program_type DROP NOT NULL;
ALTER TABLE events ALTER COLUMN program_id DROP NOT NULL;

-- ============================================
-- SEED DATA FOR PROGRAMS TABLE
-- ============================================

-- Test copay card program
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('test-copay', 'copay', 'Test Copay Card Program', 'https://www.example.com/copay', true)
ON CONFLICT (program_id) DO NOTHING;

-- Test foundation program
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('test-foundation', 'foundation', 'Test Patient Foundation', 'https://www.example.com/foundation', true)
ON CONFLICT (program_id) DO NOTHING;

-- Test PAP program
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('test-pap', 'pap', 'Test Patient Assistance Program', 'https://www.example.com/pap', true)
ON CONFLICT (program_id) DO NOTHING;

-- Real-world example programs for production use
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('healthwell-medication', 'foundation', 'HealthWell Foundation - medication', 'https://www.healthwellfoundation.org/fund/medication/', true)
ON CONFLICT (program_id) DO NOTHING;

INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('pan-medication', 'foundation', 'PAN Foundation - medication', 'https://www.panfoundation.org/disease-funds/medication/', true)
ON CONFLICT (program_id) DO NOTHING;

INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('prograf-copay', 'copay', 'Prograf Co-Pay Card', 'https://www.prograf.com/savings', true)
ON CONFLICT (program_id) DO NOTHING;

-- Inactive program for testing 404 behavior
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('inactive-program', 'copay', 'Inactive Test Program', 'https://www.example.com/inactive', false)
ON CONFLICT (program_id) DO NOTHING;
