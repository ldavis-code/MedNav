-- Migration: Add cost tier fields to medications table
-- Run this in Neon SQL Editor after 002_medications_table.sql

-- ============================================
-- ADD NEW COLUMNS FOR COST/TIER INFORMATION
-- ============================================

-- Add cost_tier column: low, medium, or high
ALTER TABLE medications ADD COLUMN IF NOT EXISTS cost_tier TEXT;

-- Add generic_available column: true or false
ALTER TABLE medications ADD COLUMN IF NOT EXISTS generic_available BOOLEAN;

-- Add typical_copay_tier column: 1, 2, 3, 4, 5, or 'Specialty'
ALTER TABLE medications ADD COLUMN IF NOT EXISTS typical_copay_tier TEXT;

-- Create index on cost_tier for filtering
CREATE INDEX IF NOT EXISTS idx_medications_cost_tier ON medications(cost_tier);

-- Create index on generic_available for filtering
CREATE INDEX IF NOT EXISTS idx_medications_generic_available ON medications(generic_available);

-- ============================================
-- UPDATE ALL MEDICATIONS WITH COST/TIER DATA
-- ============================================

-- Immunosuppressants
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'tacrolimus';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'cyclosporine';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'mycophenolate';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'myfortic';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'imuran';
UPDATE medications SET cost_tier = 'high', generic_available = true, typical_copay_tier = '3' WHERE id = 'sirolimus';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '4' WHERE id = 'everolimus';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'belatacept';

-- Induction
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'simulect';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'thymoglobulin';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'atgam';

-- Steroids
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'prednisone';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'solumedrol';

-- Anti-virals
UPDATE medications SET cost_tier = 'high', generic_available = true, typical_copay_tier = '3' WHERE id = 'valcyte';
UPDATE medications SET cost_tier = 'high', generic_available = true, typical_copay_tier = '3' WHERE id = 'cytovene';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'zovirax';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'valtrex';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'prevymis';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'livtencity';

-- Antibiotics
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'bactrim';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'amoxicillin';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'azithromycin';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'ciprofloxacin';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'levofloxacin';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'doxycycline';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'cephalexin';

-- Anti-fungals
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'diflucan';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'nystatin';
UPDATE medications SET cost_tier = 'high', generic_available = true, typical_copay_tier = '3' WHERE id = 'noxafil';
UPDATE medications SET cost_tier = 'high', generic_available = true, typical_copay_tier = '3' WHERE id = 'vfend';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'cresemba';

-- Hepatitis B
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'baraclude';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '4' WHERE id = 'vemlidy';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'viread';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'hbig';

-- Hepatitis C
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'epclusa';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'mavyret';

-- Liver Support
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '4' WHERE id = 'xifaxan';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'lactulose';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'ursodiol';

-- Enzymes
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '3' WHERE id = 'creon';

-- Heart Support
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '4' WHERE id = 'entresto';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '3' WHERE id = 'jardiance';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '3' WHERE id = 'farxiga';

-- Kidney Support
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'renvela';

-- Diuretics
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'lasix';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'aldactone';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'hydrochlorothiazide';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'chlorthalidone';

-- Beta Blockers
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'inderal';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'coreg';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'lopressor';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'atenolol';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'bisoprolol';

-- Stomach Protection
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'protonix';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'omeprazole';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'esomeprazole';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'lansoprazole';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'famotidine';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'ranitidine';

-- Pulmonary Hypertension
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'revatio';
UPDATE medications SET cost_tier = 'high', generic_available = true, typical_copay_tier = '4' WHERE id = 'tracleer';
UPDATE medications SET cost_tier = 'high', generic_available = true, typical_copay_tier = '4' WHERE id = 'letairis';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'opsumit';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'adempas';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'uptravi';
UPDATE medications SET cost_tier = 'high', generic_available = true, typical_copay_tier = 'Specialty' WHERE id = 'flolan';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'remodulin';

-- Anemia (ESRD)
UPDATE medications SET cost_tier = 'high', generic_available = true, typical_copay_tier = 'Specialty' WHERE id = 'procrit';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'aranesp';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'mircera';

-- Iron Supplements (ESRD)
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '3' WHERE id = 'venofer';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'feraheme';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'injectafer';

-- Vitamin D (ESRD)
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'calcitriol';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'zemplar';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'hectorol';

-- Hyperparathyroidism (ESRD)
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'sensipar';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'parsabiv';

-- Phosphate Binders (ESRD)
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '4' WHERE id = 'auryxia';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'phoslo';

-- Acute Rejection
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'campath';
UPDATE medications SET cost_tier = 'high', generic_available = true, typical_copay_tier = 'Specialty' WHERE id = 'rituxan';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'ivig';

-- Antibody-Mediated Rejection
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'soliris';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'ultomiris';

-- ACE Inhibitors
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'lisinopril';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'enalapril';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'ramipril';

-- ARBs
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'losartan';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'valsartan';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'olmesartan';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'irbesartan';

-- Calcium Channel Blockers
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'amlodipine';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'diltiazem';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'nifedipine';

-- Statins
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'atorvastatin';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'simvastatin';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'rosuvastatin';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'pravastatin';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'lovastatin';

-- Antiplatelets
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'clopidogrel';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'aspirin';

-- Anticoagulants
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'warfarin';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '3' WHERE id = 'apixaban';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '3' WHERE id = 'rivaroxaban';

-- Cardiac Glycoside
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'digoxin';

-- Diabetes
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'metformin';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'glipizide';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'glyburide';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'glimepiride';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '3' WHERE id = 'sitagliptin';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '4' WHERE id = 'semaglutide';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '4' WHERE id = 'dulaglutide';

-- Insulin
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'insulin-glargine';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'insulin-lispro';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'insulin-aspart';

-- Thyroid
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'levothyroxine';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'liothyronine';

-- Bronchodilators
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'albuterol';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '3' WHERE id = 'tiotropium';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'levalbuterol';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'ipratropium';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'ipratropium-albuterol';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '3' WHERE id = 'umeclidinium-vilanterol';

-- Respiratory
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'fluticasone-salmeterol';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'budesonide-formoterol';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'montelukast';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '3' WHERE id = 'fluticasone-vilanterol';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = '3' WHERE id = 'mometasone-formoterol';

-- Inhaled Corticosteroids
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'fluticasone';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'budesonide-inhaled';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'beclomethasone';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'mometasone-inhaled';
UPDATE medications SET cost_tier = 'medium', generic_available = false, typical_copay_tier = '3' WHERE id = 'ciclesonide';

-- Asthma Biologics
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'omalizumab';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'mepolizumab';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'benralizumab';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'dupilumab';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'tezepelumab';

-- Leukotriene Modifiers
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'zafirlukast';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'zileuton';

-- Antihistamines
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'cetirizine';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'loratadine';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'fexofenadine';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'levocetirizine';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'desloratadine';

-- Nasal Corticosteroids
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'fluticasone-nasal';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'mometasone-nasal';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'triamcinolone-nasal';

-- Nasal Antihistamines
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'azelastine-nasal';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'olopatadine-nasal';

-- Mast Cell Stabilizer
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'cromolyn';

-- Pain Relief
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'tramadol';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'hydrocodone-acetaminophen';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'oxycodone';

-- Nerve Pain
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'gabapentin';
UPDATE medications SET cost_tier = 'medium', generic_available = true, typical_copay_tier = '2' WHERE id = 'pregabalin';

-- NSAIDs
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'meloxicam';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'ibuprofen';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'naproxen';

-- Antidepressants
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'sertraline';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'escitalopram';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'fluoxetine';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'citalopram';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'duloxetine';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'venlafaxine';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'bupropion';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'trazodone';

-- Anxiety
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'alprazolam';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'lorazepam';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'clonazepam';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'buspirone';

-- Sleep Aid
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'zolpidem';

-- Antipsychotic
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'quetiapine';

-- Vitamins
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'vitamin-d';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'folic-acid';

-- Gout
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'allopurinol';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'colchicine';

-- Fatty Liver Disease (NASH)
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'vitamin-e';
UPDATE medications SET cost_tier = 'low', generic_available = true, typical_copay_tier = '1' WHERE id = 'pioglitazone';
UPDATE medications SET cost_tier = 'high', generic_available = false, typical_copay_tier = 'Specialty' WHERE id = 'resmetirom';
