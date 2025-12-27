-- Migration: Add copay card and program ID columns to medications table
-- Run this in Neon SQL Editor after 008_real_programs.sql

-- ============================================
-- ADD COPAY AND PROGRAM ID COLUMNS
-- ============================================

-- Add pap_program_id column for linking to programs table
ALTER TABLE medications ADD COLUMN IF NOT EXISTS pap_program_id TEXT;

-- Add copay_url column for direct copay card URLs
ALTER TABLE medications ADD COLUMN IF NOT EXISTS copay_url TEXT;

-- Add copay_program_id column for linking to programs table
ALTER TABLE medications ADD COLUMN IF NOT EXISTS copay_program_id TEXT;

-- Add support_url column for additional patient support services
ALTER TABLE medications ADD COLUMN IF NOT EXISTS support_url TEXT;

-- Create index on pap_program_id for joins
CREATE INDEX IF NOT EXISTS idx_medications_pap_program_id ON medications(pap_program_id);

-- Create index on copay_program_id for joins
CREATE INDEX IF NOT EXISTS idx_medications_copay_program_id ON medications(copay_program_id);

-- ============================================
-- UPDATE MEDICATIONS WITH PAP PROGRAM IDS
-- ============================================

-- Astellas medications
UPDATE medications SET pap_program_id = 'astellas-pap' WHERE id IN ('tacrolimus', 'cresemba');

-- Novartis medications
UPDATE medications SET pap_program_id = 'novartis-pap' WHERE id IN ('cyclosporine', 'myfortic', 'everolimus', 'simulect', 'entresto');

-- Genentech medications
UPDATE medications SET pap_program_id = 'genentech-pap' WHERE id IN ('mycophenolate', 'valcyte', 'cytovene', 'rituxan', 'omalizumab');

-- Pfizer medications
UPDATE medications SET pap_program_id = 'pfizer-pap' WHERE id IN ('sirolimus', 'atgam', 'solumedrol', 'diflucan', 'vfend', 'revatio', 'aldactone', 'pregabalin');

-- Bristol Myers Squibb medications
UPDATE medications SET pap_program_id = 'bms-pap' WHERE id IN ('belatacept', 'baraclude', 'apixaban');

-- Sanofi medications
UPDATE medications SET pap_program_id = 'sanofi-pap' WHERE id IN ('thymoglobulin', 'renvela', 'campath', 'insulin-glargine', 'hectorol');

-- Merck medications
UPDATE medications SET pap_program_id = 'merck-pap' WHERE id IN ('prevymis', 'noxafil', 'sitagliptin');

-- Takeda medications
UPDATE medications SET pap_program_id = 'takeda-pap' WHERE id IN ('livtencity', 'pioglitazone');

-- Gilead medications
UPDATE medications SET pap_program_id = 'gilead-pap' WHERE id IN ('vemlidy', 'viread', 'epclusa', 'letairis');

-- AbbVie medications
UPDATE medications SET pap_program_id = 'abbvie-pap' WHERE id IN ('mavyret', 'zemplar');

-- Janssen medications
UPDATE medications SET pap_program_id = 'janssen-pap' WHERE id IN ('tracleer', 'opsumit', 'uptravi', 'rivaroxaban', 'procrit');

-- Amgen medications
UPDATE medications SET pap_program_id = 'amgen-pap' WHERE id IN ('aranesp', 'sensipar', 'parsabiv');

-- GlaxoSmithKline medications
UPDATE medications SET pap_program_id = 'gsk-pap' WHERE id IN ('flolan', 'fluticasone-salmeterol', 'fluticasone-vilanterol', 'fluticasone', 'fluticasone-nasal', 'mepolizumab', 'umeclidinium-vilanterol');

-- AstraZeneca medications
UPDATE medications SET pap_program_id = 'astrazeneca-pap' WHERE id IN ('farxiga', 'budesonide-formoterol', 'budesonide-inhaled', 'benralizumab', 'tezepelumab');

-- Boehringer Ingelheim medications
UPDATE medications SET pap_program_id = 'boehringer-pap' WHERE id IN ('jardiance', 'tiotropium', 'ipratropium', 'ipratropium-albuterol');

-- United Therapeutics medications
UPDATE medications SET pap_program_id = 'united-therapeutics-pap' WHERE id IN ('remodulin');

-- Alexion medications
UPDATE medications SET pap_program_id = 'alexion-pap' WHERE id IN ('soliris', 'ultomiris');

-- Lilly medications
UPDATE medications SET pap_program_id = 'lilly-pap' WHERE id IN ('dulaglutide', 'insulin-lispro');

-- Novo Nordisk medications
UPDATE medications SET pap_program_id = 'novonordisk-pap' WHERE id IN ('semaglutide', 'insulin-aspart');

-- Regeneron/Sanofi medications
UPDATE medications SET pap_program_id = 'regeneron-pap' WHERE id IN ('dupilumab');

-- Madrigal medications
UPDATE medications SET pap_program_id = 'madrigal-pap' WHERE id IN ('resmetirom');

-- ============================================
-- UPDATE XIFAXAN WITH COPAY CARD INFO
-- ============================================

UPDATE medications SET
    copay_url = 'https://xifaxan.copaysavingsprogram.com/',
    copay_program_id = 'xifaxan-copay'
WHERE id = 'xifaxan';
