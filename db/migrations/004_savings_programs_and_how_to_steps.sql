-- Migration: Create savings_programs and how_to_steps tables
-- Run this in Neon SQL Editor after 003_add_medication_cost_tiers.sql

-- ============================================
-- SAVINGS PROGRAMS TABLE
-- ============================================
-- Stores copay cards, PAPs, foundations, and discount programs
CREATE TABLE IF NOT EXISTS savings_programs (
    id SERIAL PRIMARY KEY,

    -- Program identification
    program_name TEXT NOT NULL,
    program_type TEXT NOT NULL CHECK (program_type IN ('copay_card', 'pap', 'foundation', 'discount_card', 'discount_pharmacy')),
    manufacturer TEXT,                              -- For manufacturer programs (copay cards, PAPs)

    -- Optional link to specific medication(s)
    -- NULL means program covers multiple/all medications (e.g., foundations, discount cards)
    medication_id TEXT REFERENCES medications(id) ON DELETE SET NULL,

    -- Insurance eligibility flags
    commercial_eligible BOOLEAN DEFAULT false,      -- Commercial/Employer insurance
    medicare_eligible BOOLEAN DEFAULT false,        -- Medicare (typically NO for copay cards)
    medicaid_eligible BOOLEAN DEFAULT false,        -- Medicaid (State)
    uninsured_eligible BOOLEAN DEFAULT false,       -- Uninsured/Self-pay
    tricare_va_eligible BOOLEAN DEFAULT false,      -- TRICARE/VA
    ihs_tribal_eligible BOOLEAN DEFAULT false,      -- Indian Health Service/Tribal

    -- Program details
    income_limit TEXT,                              -- e.g., "400% FPL", "none", "$100,000/year"
    max_benefit TEXT,                               -- e.g., "$3,000/year", "free medication", "$0 copay"
    application_url TEXT,                           -- Direct link to apply
    phone TEXT,                                     -- Phone number for assistance

    -- Status and notes
    fund_status_note TEXT,                          -- e.g., "Check website - funds open/close based on availability"
    is_active BOOLEAN DEFAULT true,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_savings_programs_type ON savings_programs(program_type);
CREATE INDEX IF NOT EXISTS idx_savings_programs_medication ON savings_programs(medication_id);
CREATE INDEX IF NOT EXISTS idx_savings_programs_commercial ON savings_programs(commercial_eligible) WHERE commercial_eligible = true;
CREATE INDEX IF NOT EXISTS idx_savings_programs_medicare ON savings_programs(medicare_eligible) WHERE medicare_eligible = true;
CREATE INDEX IF NOT EXISTS idx_savings_programs_uninsured ON savings_programs(uninsured_eligible) WHERE uninsured_eligible = true;

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS savings_programs_updated_at ON savings_programs;
CREATE TRIGGER savings_programs_updated_at
    BEFORE UPDATE ON savings_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- HOW-TO STEPS TABLE
-- ============================================
-- Step-by-step instructions for applying to each program
CREATE TABLE IF NOT EXISTS how_to_steps (
    step_id SERIAL PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES savings_programs(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    step_title TEXT NOT NULL,
    step_detail TEXT NOT NULL,
    tip TEXT,                                       -- Helpful tip for this step
    common_mistake TEXT,                            -- Common mistake to avoid

    -- Ensure steps are unique per program
    UNIQUE(program_id, step_number)
);

-- Index for fetching steps by program
CREATE INDEX IF NOT EXISTS idx_how_to_steps_program ON how_to_steps(program_id);

-- ============================================
-- INSERT FOUNDATION PROGRAMS
-- ============================================
-- These are not medication-specific and cover multiple conditions

INSERT INTO savings_programs (program_name, program_type, commercial_eligible, medicare_eligible, medicaid_eligible, uninsured_eligible, tricare_va_eligible, ihs_tribal_eligible, income_limit, max_benefit, application_url, phone, fund_status_note) VALUES

-- HealthWell Foundation
('HealthWell Foundation', 'foundation', true, true, false, false, false, false, '500% FPL', 'Varies by fund', 'https://www.healthwellfoundation.org/', '1-800-675-8416', 'Funds open/close based on availability - check website frequently'),

-- PAN Foundation
('PAN Foundation', 'foundation', true, true, false, false, false, false, '400% FPL', 'Varies by fund', 'https://www.panfoundation.org/', '1-866-316-7263', 'Funds open/close based on availability - sign up for alerts'),

-- Patient Advocate Foundation
('Patient Advocate Foundation Co-Pay Relief', 'foundation', true, true, false, false, false, false, '400% FPL', 'Up to $12,000/year', 'https://www.copays.org/', '1-866-512-3861', 'Disease-specific funds - check eligibility'),

-- American Kidney Fund
('American Kidney Fund', 'foundation', true, true, true, true, true, true, 'Based on need', 'Varies', 'https://www.kidneyfund.org/', '1-800-638-8299', 'Kidney patients only - includes HIPP for insurance premiums'),

-- NORD RareCare
('NORD RareCare', 'foundation', true, true, false, true, false, false, 'Varies', 'Varies by program', 'https://rarediseases.org/patients-and-families/help-access-medications/', '1-800-999-6673', 'For rare disease patients'),

-- Patient Services Inc (PSI)
('Patient Services Inc (PSI)', 'foundation', true, true, false, false, false, false, '500% FPL', 'Varies by fund', 'https://www.accessiahealth.org/', '1-800-366-7741', 'Multiple disease-specific funds available')

ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT DISCOUNT CARD/PHARMACY PROGRAMS
-- ============================================

INSERT INTO savings_programs (program_name, program_type, commercial_eligible, medicare_eligible, medicaid_eligible, uninsured_eligible, tricare_va_eligible, ihs_tribal_eligible, income_limit, max_benefit, application_url, phone, fund_status_note) VALUES

-- GoodRx
('GoodRx', 'discount_card', true, true, true, true, true, true, 'none', 'Up to 80% off retail', 'https://www.goodrx.com/', NULL, 'Free to use - compare prices across pharmacies'),

-- SingleCare
('SingleCare', 'discount_card', true, true, true, true, true, true, 'none', 'Up to 80% off retail', 'https://www.singlecare.com/', '1-844-234-3057', 'Free prescription savings card'),

-- Cost Plus Drugs
('Mark Cuban Cost Plus Drugs', 'discount_pharmacy', true, true, true, true, true, true, 'none', 'Cost + 15% + $5 pharmacy fee', 'https://costplusdrugs.com/', NULL, 'Online pharmacy - mail order only'),

-- Amazon Pharmacy
('Amazon Pharmacy', 'discount_pharmacy', true, true, true, true, true, true, 'none', 'Varies - Prime members get extra savings', 'https://pharmacy.amazon.com/', NULL, 'Prime membership provides additional discounts'),

-- Blink Health
('Blink Health', 'discount_card', true, true, true, true, true, true, 'none', 'Up to 80% off retail', 'https://www.blinkhealth.com/', '1-844-265-6444', 'Pay online, pick up at pharmacy')

ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT MANUFACTURER COPAY CARDS (Commercial Only)
-- ============================================
-- These are tied to specific medications and are for Commercial insurance ONLY

INSERT INTO savings_programs (program_name, program_type, medication_id, manufacturer, commercial_eligible, medicare_eligible, medicaid_eligible, uninsured_eligible, tricare_va_eligible, ihs_tribal_eligible, income_limit, max_benefit, application_url, phone, fund_status_note) VALUES

-- Tacrolimus/Prograf (Astellas)
('Astellas Patient Support Solutions - Prograf', 'copay_card', 'tacrolimus', 'Astellas', true, false, false, false, false, false, 'none', 'Pay as little as $0', 'https://www.astellaspharmasupportsolutions.com/', '1-800-477-6472', 'Commercial insurance only'),

-- Everolimus/Zortress (Novartis)
('Novartis Copay Card - Zortress', 'copay_card', 'everolimus', 'Novartis', true, false, false, false, false, false, 'none', 'Pay as little as $0', 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance', '1-800-277-2254', 'Commercial insurance only'),

-- Valcyte (Genentech)
('Genentech Access Solutions - Valcyte', 'copay_card', 'valcyte', 'Genentech', true, false, false, false, false, false, 'none', 'Pay as little as $0', 'https://www.genentech-access.com/patient.html', '1-866-422-2377', 'Commercial insurance only'),

-- Belatacept/Nulojix (BMS)
('BMS Access Support - Nulojix', 'copay_card', 'belatacept', 'Bristol Myers Squibb', true, false, false, false, false, false, 'none', 'Pay $0 for first year', 'https://www.bmsaccesssupport.bmscustomerconnect.com/', '1-800-861-0048', 'Commercial insurance only'),

-- Entresto (Novartis)
('Novartis Copay Card - Entresto', 'copay_card', 'entresto', 'Novartis', true, false, false, false, false, false, 'none', 'Pay as little as $10', 'https://www.entresto.com/heart-failure/entresto-savings-and-support', '1-800-277-2254', 'Commercial insurance only'),

-- Jardiance (Boehringer Ingelheim)
('Jardiance Savings Card', 'copay_card', 'jardiance', 'Boehringer Ingelheim', true, false, false, false, false, false, 'none', 'Pay as little as $10', 'https://www.jardiance.com/savings/', '1-800-243-0127', 'Commercial insurance only'),

-- Farxiga (AstraZeneca)
('Farxiga Savings Card', 'copay_card', 'farxiga', 'AstraZeneca', true, false, false, false, false, false, 'none', 'Pay as little as $0', 'https://www.farxiga.com/savings-and-support', '1-800-236-9933', 'Commercial insurance only'),

-- Xifaxan (Bausch)
('Xifaxan Savings Program', 'copay_card', 'xifaxan', 'Bausch Health', true, false, false, false, false, false, 'none', 'Pay as little as $0', 'https://xifaxan.copaysavingsprogram.com/', '1-844-943-2926', 'Commercial insurance only'),

-- Eliquis (BMS)
('Eliquis Savings Card', 'copay_card', 'apixaban', 'Bristol Myers Squibb', true, false, false, false, false, false, 'none', 'Pay as little as $10', 'https://www.eliquis.bmscustomerconnect.com/afib/eliquis-free-trial-and-savings', '1-855-354-7847', 'Commercial insurance only'),

-- Xarelto (Janssen)
('Xarelto Savings Program', 'copay_card', 'rivaroxaban', 'Janssen', true, false, false, false, false, false, 'none', 'Pay as little as $10', 'https://www.jnjwithme.com/', '1-800-526-7736', 'Commercial insurance only')

ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT MANUFACTURER PAPs (For Uninsured/Underinsured)
-- ============================================

INSERT INTO savings_programs (program_name, program_type, medication_id, manufacturer, commercial_eligible, medicare_eligible, medicaid_eligible, uninsured_eligible, tricare_va_eligible, ihs_tribal_eligible, income_limit, max_benefit, application_url, phone, fund_status_note) VALUES

-- Astellas PAP
('Astellas Patient Assistance Program', 'pap', 'tacrolimus', 'Astellas', false, true, false, true, false, false, '400% FPL', 'Free medication', 'https://www.astellaspharmasupportsolutions.com/', '1-800-477-6472', 'For uninsured or Medicare patients'),

-- Novartis PAP
('Novartis Patient Assistance Program', 'pap', 'everolimus', 'Novartis', false, true, false, true, false, false, '400% FPL', 'Free medication', 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance', '1-800-277-2254', 'Covers Zortress, Myfortic, and other Novartis meds'),

-- Genentech PAP
('Genentech Patient Foundation', 'pap', 'valcyte', 'Genentech', false, true, false, true, false, false, '500% FPL', 'Free medication', 'https://www.genentech-access.com/patient/brands/valcyte/patient-foundation.html', '1-866-422-2377', 'Covers Valcyte and other Genentech meds'),

-- BMS PAP
('Bristol Myers Squibb Patient Assistance', 'pap', 'belatacept', 'Bristol Myers Squibb', false, true, false, true, false, false, '300% FPL', 'Free medication', 'https://www.bmsaccesssupport.bmscustomerconnect.com/', '1-800-861-0048', 'Covers Nulojix and other BMS meds'),

-- Pfizer PAP
('Pfizer RxPathways', 'pap', 'sirolimus', 'Pfizer', false, true, false, true, false, false, '400% FPL', 'Free medication', 'https://www.pfizerrxpathways.com/', '1-844-989-7284', 'Covers Rapamune and many other Pfizer meds'),

-- Gilead PAP
('Gilead Advancing Access', 'pap', 'vemlidy', 'Gilead', false, true, false, true, false, false, '500% FPL', 'Free medication', 'https://www.gileadadvancingaccess.com/', '1-800-226-2056', 'Covers Vemlidy, Epclusa, and Hep B/C meds'),

-- Merck PAP
('Merck Patient Assistance Program', 'pap', 'prevymis', 'Merck', false, true, false, true, false, false, '400% FPL', 'Free medication', 'https://www.merckhelps.com/', '1-800-727-5400', 'Covers Prevymis and other Merck meds'),

-- Sanofi PAP
('Sanofi Patient Connection', 'pap', 'thymoglobulin', 'Sanofi', false, true, false, true, false, false, '400% FPL', 'Free medication', 'https://www.sanofipatientconnection.com/', '1-888-847-4877', 'Covers Thymoglobulin and other Sanofi meds'),

-- AbbVie PAP
('AbbVie Patient Assistance Foundation', 'pap', 'mavyret', 'AbbVie', false, true, false, true, false, false, '400% FPL', 'Free medication', 'https://www.abbvie.com/patients/patient-assistance.html', '1-800-222-6885', 'Covers Mavyret, Creon, and other AbbVie meds'),

-- Lilly PAP
('Lilly Cares Foundation', 'pap', 'insulin-lispro', 'Lilly', false, true, false, true, false, false, '400% FPL', 'Free medication', 'https://www.lillycares.com/', '1-800-545-6962', 'Covers Humalog and other Lilly insulins')

ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT HOW-TO STEPS FOR KEY PROGRAMS
-- ============================================

-- Steps for HealthWell Foundation
INSERT INTO how_to_steps (program_id, step_number, step_title, step_detail, tip, common_mistake) VALUES
((SELECT id FROM savings_programs WHERE program_name = 'HealthWell Foundation' LIMIT 1), 1, 'Check Fund Availability', 'Visit healthwellfoundation.org and search for your disease/condition to see if a fund is currently open.', 'Funds can open and close quickly - bookmark the page and check frequently!', 'Assuming a fund is always available - they have limited budgets'),
((SELECT id FROM savings_programs WHERE program_name = 'HealthWell Foundation' LIMIT 1), 2, 'Verify Eligibility', 'Review income requirements (typically up to 500% FPL) and insurance requirements for your specific fund.', 'Have your income documents ready before starting', 'Not checking the specific fund requirements - they vary by disease'),
((SELECT id FROM savings_programs WHERE program_name = 'HealthWell Foundation' LIMIT 1), 3, 'Complete Online Application', 'Fill out the patient application on the HealthWell website with your personal, insurance, and prescription information.', 'Use the exact medication name as written on your prescription', 'Entering incorrect insurance information'),
((SELECT id FROM savings_programs WHERE program_name = 'HealthWell Foundation' LIMIT 1), 4, 'Submit Required Documents', 'Upload proof of income (tax return, pay stubs, or SS award letter) and insurance card.', 'Social Security benefit letters count as income documentation', 'Submitting outdated income documents'),
((SELECT id FROM savings_programs WHERE program_name = 'HealthWell Foundation' LIMIT 1), 5, 'Wait for Approval', 'Processing typically takes 3-5 business days. You will receive a virtual card or physical card in the mail.', 'Sign up for email/text notifications to track status', 'Not providing complete information, which delays processing')
ON CONFLICT (program_id, step_number) DO NOTHING;

-- Steps for PAN Foundation
INSERT INTO how_to_steps (program_id, step_number, step_title, step_detail, tip, common_mistake) VALUES
((SELECT id FROM savings_programs WHERE program_name = 'PAN Foundation' LIMIT 1), 1, 'Search Available Funds', 'Go to panfoundation.org and use FundFinder to search for your condition or medication.', 'Sign up for alerts to be notified when closed funds reopen', 'Waiting too long - popular funds run out quickly'),
((SELECT id FROM savings_programs WHERE program_name = 'PAN Foundation' LIMIT 1), 2, 'Create Patient Account', 'Register on the PAN website with your email and create a password to start your application.', 'Use an email you check regularly for status updates', 'Using an old email address you do not monitor'),
((SELECT id FROM savings_programs WHERE program_name = 'PAN Foundation' LIMIT 1), 3, 'Complete Application', 'Fill in your personal information, insurance details, and select your medication(s).', 'List ALL medications you need help with from their available funds', 'Only applying for one medication when you qualify for multiple'),
((SELECT id FROM savings_programs WHERE program_name = 'PAN Foundation' LIMIT 1), 4, 'Submit Income Verification', 'Upload proof of household income (400% FPL limit for most funds).', 'A signed attestation form may be accepted if you cannot provide documents', 'Not including all household members income'),
((SELECT id FROM savings_programs WHERE program_name = 'PAN Foundation' LIMIT 1), 5, 'Use Your Grant', 'Once approved, present your PAN card at the pharmacy. They will bill PAN directly for your copay.', 'Keep track of your grant balance - you may need to reapply annually', 'Forgetting to use the card at the pharmacy')
ON CONFLICT (program_id, step_number) DO NOTHING;

-- Steps for GoodRx
INSERT INTO how_to_steps (program_id, step_number, step_title, step_detail, tip, common_mistake) VALUES
((SELECT id FROM savings_programs WHERE program_name = 'GoodRx' LIMIT 1), 1, 'Search Your Medication', 'Go to goodrx.com and enter your medication name, dose, and quantity.', 'Check both brand and generic names - prices can vary significantly', 'Not specifying the exact dose and quantity'),
((SELECT id FROM savings_programs WHERE program_name = 'GoodRx' LIMIT 1), 2, 'Compare Pharmacy Prices', 'Review prices at different pharmacies in your area - they can vary by $100+ for the same medication.', 'Independent pharmacies sometimes have better prices than chains', 'Assuming all pharmacies have the same price'),
((SELECT id FROM savings_programs WHERE program_name = 'GoodRx' LIMIT 1), 3, 'Get Your Coupon', 'Click the price at your preferred pharmacy to get a coupon code (no signup required for basic coupons).', 'Screenshot or print the coupon - do not rely on phone battery', 'Not having the coupon ready at the pharmacy counter'),
((SELECT id FROM savings_programs WHERE program_name = 'GoodRx' LIMIT 1), 4, 'Present at Pharmacy', 'Give the coupon to your pharmacist BEFORE they process your prescription through insurance.', 'Ask the pharmacist to compare the GoodRx price to your insurance copay', 'Using GoodRx when your insurance copay is actually lower'),
((SELECT id FROM savings_programs WHERE program_name = 'GoodRx' LIMIT 1), 5, 'Compare to Insurance', 'If the GoodRx price is lower than your copay, use GoodRx. This will NOT count toward your deductible.', 'Using GoodRx instead of insurance does not count toward your annual deductible', 'Not realizing GoodRx payments do not count toward deductible')
ON CONFLICT (program_id, step_number) DO NOTHING;

-- Steps for Manufacturer PAP (generic steps)
INSERT INTO how_to_steps (program_id, step_number, step_title, step_detail, tip, common_mistake) VALUES
((SELECT id FROM savings_programs WHERE program_name = 'Genentech Patient Foundation' LIMIT 1), 1, 'Download Application', 'Visit genentech-access.com and download the patient assistance application form.', 'There is usually a patient section and a prescriber section', 'Only completing the patient section'),
((SELECT id FROM savings_programs WHERE program_name = 'Genentech Patient Foundation' LIMIT 1), 2, 'Complete Patient Section', 'Fill in your personal information, insurance status, and household income.', 'If you have Medicare Part D, you may still qualify for a PAP', 'Assuming you do not qualify because you have some insurance'),
((SELECT id FROM savings_programs WHERE program_name = 'Genentech Patient Foundation' LIMIT 1), 3, 'Send to Your Doctor', 'Give or fax the form to your prescribing doctor to complete the medical necessity section.', 'Call ahead to ask how long your doctor office takes to complete forms', 'Not following up with the doctor office'),
((SELECT id FROM savings_programs WHERE program_name = 'Genentech Patient Foundation' LIMIT 1), 4, 'Attach Income Documents', 'Include your most recent tax return OR 2 recent pay stubs OR Social Security award letter.', 'If you filed jointly, include both you and spouse income', 'Not including documentation for all household members'),
((SELECT id FROM savings_programs WHERE program_name = 'Genentech Patient Foundation' LIMIT 1), 5, 'Submit and Wait', 'Mail or fax the completed application. Approval typically takes 2-4 weeks.', 'Ask your doctor for samples while waiting for approval', 'Running out of medication before approval comes through'),
((SELECT id FROM savings_programs WHERE program_name = 'Genentech Patient Foundation' LIMIT 1), 6, 'Receive Medication', 'Once approved, medication is shipped directly to you or your doctor office at no cost.', 'Mark your calendar to reapply before your enrollment period ends (usually 1 year)', 'Forgetting to reapply and running out of medication')
ON CONFLICT (program_id, step_number) DO NOTHING;

-- Steps for Cost Plus Drugs
INSERT INTO how_to_steps (program_id, step_number, step_title, step_detail, tip, common_mistake) VALUES
((SELECT id FROM savings_programs WHERE program_name = 'Mark Cuban Cost Plus Drugs' LIMIT 1), 1, 'Search Medication', 'Visit costplusdrugs.com and search for your medication to see if it is available.', 'Not all medications are available - mainly generics', 'Assuming all medications are available'),
((SELECT id FROM savings_programs WHERE program_name = 'Mark Cuban Cost Plus Drugs' LIMIT 1), 2, 'Create Account', 'Sign up with your email and provide shipping information.', 'You will need a valid prescription to complete the order', 'Trying to order without a prescription'),
((SELECT id FROM savings_programs WHERE program_name = 'Mark Cuban Cost Plus Drugs' LIMIT 1), 3, 'Transfer Prescription', 'Either have your doctor send a new prescription or transfer from your current pharmacy.', 'Call Cost Plus to help transfer if you have issues', 'Not having your pharmacy transfer info ready'),
((SELECT id FROM savings_programs WHERE program_name = 'Mark Cuban Cost Plus Drugs' LIMIT 1), 4, 'Place Order', 'Once prescription is received, complete your order. Price = Drug Cost + 15% + $5 pharmacy fee + shipping.', 'Ordering a 90-day supply saves on shipping costs', 'Ordering 30-day supplies and paying more shipping'),
((SELECT id FROM savings_programs WHERE program_name = 'Mark Cuban Cost Plus Drugs' LIMIT 1), 5, 'Receive by Mail', 'Medication ships via mail order. Allow 5-7 business days for delivery.', 'Plan ahead - do not wait until you run out to order', 'Running out of medication while waiting for delivery')
ON CONFLICT (program_id, step_number) DO NOTHING;
