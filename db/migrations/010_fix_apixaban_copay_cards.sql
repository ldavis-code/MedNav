-- Migration: Fix Apixaban/Eliquis copay card data
-- Ensures the Eliquis Savings Card is properly linked and adds missing BMS PAP
-- Run this in Neon SQL Editor after 009_add_copay_columns.sql

-- ============================================
-- ADD ELIQUIS COPAY CARD TO PROGRAMS TABLE
-- ============================================
-- This enables click tracking for the Eliquis copay card

INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('eliquis-copay', 'copay', 'Eliquis Savings Card', 'https://www.eliquis.bmscustomerconnect.com/afib/eliquis-free-trial-and-savings', true)
ON CONFLICT (program_id) DO UPDATE SET
    official_url = EXCLUDED.official_url,
    name = EXCLUDED.name,
    active = EXCLUDED.active;

-- ============================================
-- UPDATE APIXABAN MEDICATION WITH COPAY INFO
-- ============================================
-- Links the Eliquis copay card directly to the apixaban medication entry

UPDATE medications SET
    copay_url = 'https://www.eliquis.bmscustomerconnect.com/afib/eliquis-free-trial-and-savings',
    copay_program_id = 'eliquis-copay'
WHERE id = 'apixaban';

-- ============================================
-- ENSURE ELIQUIS SAVINGS CARD EXISTS IN SAVINGS_PROGRAMS
-- ============================================
-- Re-insert or update the Eliquis Savings Card to ensure it's properly stored
-- The medication_id MUST be 'apixaban' (the generic name ID), not 'eliquis'

INSERT INTO savings_programs (
    program_name,
    program_type,
    medication_id,
    manufacturer,
    commercial_eligible,
    medicare_eligible,
    medicaid_eligible,
    uninsured_eligible,
    tricare_va_eligible,
    ihs_tribal_eligible,
    income_limit,
    max_benefit,
    application_url,
    phone,
    fund_status_note,
    is_active
) VALUES (
    'Eliquis Savings Card',
    'copay_card',
    'apixaban',  -- IMPORTANT: Use 'apixaban' (the medication ID), not 'eliquis'
    'Bristol Myers Squibb',
    true,   -- commercial_eligible
    false,  -- medicare_eligible (Anti-Kickback Statute)
    false,  -- medicaid_eligible
    false,  -- uninsured_eligible
    false,  -- tricare_va_eligible
    false,  -- ihs_tribal_eligible
    'none',
    'Pay as little as $10 per month',
    'https://www.eliquis.bmscustomerconnect.com/afib/eliquis-free-trial-and-savings',
    '1-855-354-7847',
    'Commercial insurance only. Not valid for patients enrolled in Medicare, Medicaid, or similar programs.',
    true
)
ON CONFLICT DO NOTHING;

-- Update existing Eliquis Savings Card if it exists to ensure correct data
UPDATE savings_programs SET
    medication_id = 'apixaban',
    max_benefit = 'Pay as little as $10 per month',
    application_url = 'https://www.eliquis.bmscustomerconnect.com/afib/eliquis-free-trial-and-savings',
    phone = '1-855-354-7847',
    fund_status_note = 'Commercial insurance only. Not valid for patients enrolled in Medicare, Medicaid, or similar programs.',
    is_active = true
WHERE program_name = 'Eliquis Savings Card' AND program_type = 'copay_card';

-- ============================================
-- ADD BMS PAP FOR APIXABAN (for non-commercial insurance)
-- ============================================
-- The existing BMS PAP is only linked to 'belatacept'
-- We need a separate entry for apixaban so non-commercial users see PAP options

INSERT INTO savings_programs (
    program_name,
    program_type,
    medication_id,
    manufacturer,
    commercial_eligible,
    medicare_eligible,
    medicaid_eligible,
    uninsured_eligible,
    tricare_va_eligible,
    ihs_tribal_eligible,
    income_limit,
    max_benefit,
    application_url,
    phone,
    fund_status_note,
    is_active
) VALUES (
    'Bristol Myers Squibb Patient Assistance - Eliquis',
    'pap',
    'apixaban',  -- Links to Apixaban/Eliquis
    'Bristol Myers Squibb',
    false,  -- commercial_eligible (PAP is for non-commercial)
    true,   -- medicare_eligible
    false,  -- medicaid_eligible
    true,   -- uninsured_eligible
    false,  -- tricare_va_eligible
    false,  -- ihs_tribal_eligible
    '300% FPL',
    'Free medication for eligible patients',
    'https://www.bmsaccesssupport.bmscustomerconnect.com/',
    '1-800-721-8909',
    'For uninsured or Medicare patients who meet income requirements',
    true
)
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY DATA (run these SELECT statements to confirm)
-- ============================================
-- SELECT id, brand_name, generic_name, copay_url, copay_program_id, pap_program_id FROM medications WHERE id = 'apixaban';
-- SELECT * FROM savings_programs WHERE medication_id = 'apixaban';
-- SELECT * FROM programs WHERE program_id = 'eliquis-copay';
