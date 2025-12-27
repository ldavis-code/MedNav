-- Migration: Add medications table to Neon database
-- Run this in Neon SQL Editor after schema.sql and 001_multi_tenant.sql

-- ============================================
-- MEDICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS medications (
    id TEXT PRIMARY KEY,
    brand_name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    rxcui TEXT,
    category TEXT NOT NULL,
    manufacturer TEXT,
    stage TEXT,
    common_organs TEXT[],
    pap_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_medications_category ON medications(category);
CREATE INDEX IF NOT EXISTS idx_medications_generic_name ON medications(generic_name);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS medications_updated_at ON medications;
CREATE TRIGGER medications_updated_at
    BEFORE UPDATE ON medications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- INSERT ALL MEDICATIONS (152 total)
-- ============================================

INSERT INTO medications (id, brand_name, generic_name, rxcui, category, manufacturer, stage, common_organs, pap_url) VALUES
-- Immunosuppressants
('tacrolimus', 'Prograf / Envarsus XR / Astagraf XL', 'Tacrolimus', '42316', 'Immunosuppressant', 'Astellas / Veloxis', 'Post-medication', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], 'https://www.astellaspharmasupportsolutions.com/'),
('cyclosporine', 'Neoral / Sandimmune / Gengraf', 'Cyclosporine', '3008', 'Immunosuppressant', 'Novartis', 'Post-medication', ARRAY['Kidney','Heart','Liver','Lung'], 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance'),
('mycophenolate', 'CellCept', 'Mycophenolate Mofetil', '68149', 'Immunosuppressant', 'Genentech', 'Post-medication', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], 'https://www.genentech-access.com/patient.html'),
('myfortic', 'Myfortic', 'Mycophenolic Acid', '327361', 'Immunosuppressant', 'Novartis', 'Post-medication', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance'),
('imuran', 'Imuran', 'Azathioprine', '1256', 'Immunosuppressant', 'Generic', 'Post-medication', ARRAY['Kidney','Liver','Heart','Lung'], NULL),
('sirolimus', 'Rapamune', 'Sirolimus', '35302', 'Immunosuppressant', 'Pfizer', 'Post-medication', ARRAY['Kidney','Lung','Liver'], 'https://www.pfizerrxpathways.com/'),
('everolimus', 'Zortress', 'Everolimus', '141704', 'Immunosuppressant', 'Novartis', 'Post-medication', ARRAY['Kidney','Liver','Heart'], 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance'),
('belatacept', 'Nulojix', 'Belatacept', '1091444', 'Immunosuppressant', 'Bristol Myers Squibb', 'Post-medication', ARRAY['Kidney'], 'https://www.bmsaccesssupport.bmscustomerconnect.com/'),

-- Induction
('simulect', 'Simulect', 'Basiliximab', '114169', 'Induction', 'Novartis', 'Post-medication', ARRAY['Kidney','Liver'], 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance'),
('thymoglobulin', 'Thymoglobulin', 'Anti-thymocyte globulin (Rabbit)', '89125', 'Induction', 'Sanofi', 'Post-medication', ARRAY['Kidney','Heart','Lung','Liver'], 'https://www.sanofipatientconnection.com/'),
('atgam', 'ATGAM', 'Anti-thymocyte globulin (Equine)', '1011', 'Induction', 'Pfizer', 'Post-medication', ARRAY['Kidney'], 'https://www.pfizerrxpathways.com/'),

-- Steroids
('prednisone', 'Deltasone', 'Prednisone', '8640', 'Steroid', 'Generic', 'Post-medication', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], NULL),
('solumedrol', 'Solu-Medrol', 'Methylprednisolone', '6902', 'Steroid', 'Pfizer', 'Post-medication', ARRAY['Kidney','Liver','Heart','Lung'], 'https://www.pfizerrxpathways.com/'),

-- Anti-virals
('valcyte', 'Valcyte', 'Valganciclovir', '284635', 'Anti-viral', 'Genentech', 'Post-medication', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], 'https://www.genentech-access.com/patient.html'),
('cytovene', 'Cytovene', 'Ganciclovir', '4629', 'Anti-viral', 'Genentech', 'Post-medication', ARRAY['Kidney','Liver','Heart','Lung'], 'https://www.genentech-access.com/patient.html'),
('zovirax', 'Zovirax', 'Acyclovir', '281', 'Anti-viral', 'Generic', 'Post-medication', ARRAY['Kidney','Liver','Heart'], NULL),
('valtrex', 'Valtrex', 'Valacyclovir', '10998', 'Anti-viral', 'Generic', 'Post-medication', ARRAY['Kidney','Liver'], NULL),
('prevymis', 'Prevymis', 'Letermovir', '1943541', 'Anti-viral', 'Merck', 'Post-medication', ARRAY['Kidney','Heart'], 'https://www.merckhelps.com/'),
('livtencity', 'Livtencity', 'Maribavir', NULL, 'Anti-viral', 'Takeda', 'Post-medication', ARRAY['Kidney','Heart','Lung'], 'https://www.takeda.com/en-us/what-we-do/patient-services/'),

-- Antibiotics
('bactrim', 'Bactrim / Septra', 'Trimethoprim-Sulfamethoxazole', '10831', 'Antibiotic', 'Generic', 'Post-medication', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], NULL),
('amoxicillin', 'Amoxil', 'Amoxicillin', NULL, 'Antibiotic', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], NULL),
('azithromycin', 'Zithromax / Z-Pak', 'Azithromycin', NULL, 'Antibiotic', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Lung'], NULL),
('ciprofloxacin', 'Cipro', 'Ciprofloxacin', NULL, 'Antibiotic', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart'], NULL),
('levofloxacin', 'Levaquin', 'Levofloxacin', NULL, 'Antibiotic', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Lung'], NULL),
('doxycycline', 'Vibramycin', 'Doxycycline', NULL, 'Antibiotic', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Lung'], NULL),
('cephalexin', 'Keflex', 'Cephalexin', NULL, 'Antibiotic', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver'], NULL),

-- Anti-fungals
('diflucan', 'Diflucan', 'Fluconazole', '4450', 'Anti-fungal', 'Pfizer', 'Post-medication', ARRAY['Kidney','Liver','Heart'], 'https://www.pfizerrxpathways.com/'),
('nystatin', 'Bio-Statin / Nystop', 'Nystatin', '7597', 'Anti-fungal', 'Generic', 'Post-medication', ARRAY['Kidney','Liver','Heart','Lung'], NULL),
('noxafil', 'Noxafil', 'Posaconazole', '282077', 'Anti-fungal', 'Merck', 'Post-medication', ARRAY['Lung','Heart'], 'https://www.merckhelps.com/'),
('vfend', 'Vfend', 'Voriconazole', '121243', 'Anti-fungal', 'Pfizer', 'Post-medication', ARRAY['Lung'], 'https://www.pfizerrxpathways.com/'),
('cresemba', 'Cresemba', 'Isavuconazonium', '1656657', 'Anti-fungal', 'Astellas', 'Post-medication', ARRAY['Lung'], 'https://www.astellaspharmasupportsolutions.com/'),

-- Hepatitis B
('baraclude', 'Baraclude', 'Entecavir', '404879', 'Hepatitis B', 'Bristol Myers Squibb', 'Both (Pre & Post)', ARRAY['Liver'], 'https://www.bmsaccesssupport.bmscustomerconnect.com/'),
('vemlidy', 'Vemlidy', 'Tenofovir Alafenamide', NULL, 'Hepatitis B', 'Gilead', 'Both (Pre & Post)', ARRAY['Liver','Kidney'], 'https://www.gileadadvancingaccess.com/'),
('viread', 'Viread', 'Tenofovir Disoproxil', '318473', 'Hepatitis B', 'Gilead', 'Both (Pre & Post)', ARRAY['Liver','Kidney'], 'https://www.gileadadvancingaccess.com/'),
('hbig', 'HepaGam B / HyperHEP B', 'Hepatitis B Immune Globulin', NULL, 'Hepatitis B', 'Saol / Grifols', 'Both (Pre & Post)', ARRAY['Liver'], 'https://www.grifolspatientcare.com/'),

-- Hepatitis C
('epclusa', 'Epclusa', 'Sofosbuvir/Velpatasvir', '1716964', 'Hepatitis C', 'Gilead', 'Both (Pre & Post)', ARRAY['Liver','Kidney'], 'https://www.gileadadvancingaccess.com/'),
('mavyret', 'Mavyret', 'Glecaprevir/Pibrentasvir', '1939261', 'Hepatitis C', 'AbbVie', 'Both (Pre & Post)', ARRAY['Liver','Kidney'], 'https://www.abbvie.com/patients/patient-assistance.html'),

-- Liver Support
('xifaxan', 'Xifaxan', 'Rifaximin', NULL, 'Liver Support', 'Bausch Health', 'Pre-medication', ARRAY['Liver'], 'https://xifaxan.copaysavingsprogram.com/'),
('lactulose', 'Kristalose / Generlac', 'Lactulose', NULL, 'Liver Support', 'Generic', 'Pre-medication', ARRAY['Liver'], NULL),
('ursodiol', 'Urso / Actigall', 'Ursodiol', '10904', 'Liver Support', 'Generic', 'Both (Pre & Post)', ARRAY['Liver'], NULL),

-- Enzymes
('creon', 'Creon / Zenpep', 'Pancrelipase', NULL, 'Enzymes', 'AbbVie / Nestle', 'Both (Pre & Post)', ARRAY['Pancreas','Lung'], 'https://www.creoninfo.com/'),

-- Heart Support
('entresto', 'Entresto', 'Sacubitril/Valsartan', NULL, 'Heart Failure', 'Novartis', 'Pre-medication', ARRAY['Heart'], 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance'),
('jardiance', 'Jardiance', 'Empagliflozin', NULL, 'Heart/Kidney Support', 'Boehringer Ingelheim', 'Both (Pre & Post)', ARRAY['Heart','Kidney'], 'https://www.boehringer-ingelheim.com/us/patient-assistance'),
('farxiga', 'Farxiga', 'Dapagliflozin', NULL, 'Heart/Kidney Support', 'AstraZeneca', 'Both (Pre & Post)', ARRAY['Heart','Kidney'], 'https://www.azandmeapp.com/'),

-- Kidney Support
('renvela', 'Renvela', 'Sevelamer', NULL, 'Kidney Support', 'Sanofi', 'Both (Pre & Post)', ARRAY['Kidney'], 'https://www.sanofipatientconnection.com/'),

-- Diuretics
('lasix', 'Lasix', 'Furosemide', '4603', 'Diuretic', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Heart','Liver'], NULL),
('aldactone', 'Aldactone', 'Spironolactone', NULL, 'Diuretic', 'Pfizer', 'Both (Pre & Post)', ARRAY['Heart','Liver'], 'https://www.pfizerrxpathways.com/'),
('hydrochlorothiazide', 'Microzide', 'Hydrochlorothiazide', NULL, 'Diuretic', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Kidney'], NULL),
('chlorthalidone', 'Thalitone', 'Chlorthalidone', NULL, 'Diuretic', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Kidney'], NULL),

-- Beta Blockers
('inderal', 'Inderal', 'Propranolol', NULL, 'Beta Blocker', 'Generic', 'Both (Pre & Post)', ARRAY['Liver','Heart'], NULL),
('coreg', 'Coreg', 'Carvedilol', '20352', 'Beta Blocker', 'Generic', 'Both (Pre & Post)', ARRAY['Heart'], NULL),
('lopressor', 'Lopressor / Toprol XL', 'Metoprolol', '6918', 'Beta Blocker', 'Generic', 'Both (Pre & Post)', ARRAY['Heart'], NULL),
('atenolol', 'Tenormin', 'Atenolol', NULL, 'Beta Blocker', 'Generic', 'Both (Pre & Post)', ARRAY['Heart'], NULL),
('bisoprolol', 'Zebeta', 'Bisoprolol', NULL, 'Beta Blocker', 'Generic', 'Both (Pre & Post)', ARRAY['Heart'], NULL),

-- Stomach Protection
('protonix', 'Protonix', 'Pantoprazole', '40790', 'Stomach Protection', 'Generic', 'Post-medication', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], NULL),
('omeprazole', 'Prilosec', 'Omeprazole', '7646', 'Proton Pump Inhibitor', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], NULL),
('esomeprazole', 'Nexium', 'Esomeprazole', NULL, 'Proton Pump Inhibitor', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Lung'], NULL),
('lansoprazole', 'Prevacid', 'Lansoprazole', NULL, 'Proton Pump Inhibitor', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart'], NULL),
('famotidine', 'Pepcid', 'Famotidine', NULL, 'H2 Blocker', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart'], NULL),
('ranitidine', 'Zantac', 'Ranitidine', NULL, 'H2 Blocker', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver'], NULL),

-- Pulmonary Hypertension
('revatio', 'Revatio / Viagra', 'Sildenafil', NULL, 'Pulmonary Hypertension', 'Pfizer', 'Pre-medication', ARRAY['Lung','Heart'], 'https://www.pfizerrxpathways.com/'),
('tracleer', 'Tracleer', 'Bosentan', NULL, 'Pulmonary Hypertension', 'Actelion/Janssen', 'Pre-medication', ARRAY['Lung','Heart'], 'https://www.jnjwithme.com/'),
('letairis', 'Letairis', 'Ambrisentan', NULL, 'Pulmonary Hypertension', 'Gilead', 'Pre-medication', ARRAY['Lung','Heart'], 'https://www.gileadadvancingaccess.com/'),
('opsumit', 'Opsumit', 'Macitentan', NULL, 'Pulmonary Hypertension', 'Actelion/Janssen', 'Pre-medication', ARRAY['Lung','Heart'], 'https://www.jnjwithme.com/'),
('adempas', 'Adempas', 'Riociguat', NULL, 'Pulmonary Hypertension', 'Bayer', 'Pre-medication', ARRAY['Lung','Heart'], 'https://www.adempas-us.com/'),
('uptravi', 'Uptravi', 'Selexipag', NULL, 'Pulmonary Hypertension', 'Actelion/Janssen', 'Pre-medication', ARRAY['Lung','Heart'], 'https://www.jnjwithme.com/'),
('flolan', 'Flolan', 'Epoprostenol', NULL, 'Pulmonary Hypertension', 'GlaxoSmithKline', 'Pre-medication', ARRAY['Lung','Heart'], 'https://www.gskforyou.com/'),
('remodulin', 'Remodulin', 'Treprostinil', NULL, 'Pulmonary Hypertension', 'United Therapeutics', 'Pre-medication', ARRAY['Lung','Heart'], 'https://unitedtherapeuticscares.com/'),

-- Anemia (ESRD)
('procrit', 'Procrit / Epogen', 'Epoetin Alfa', NULL, 'Anemia (ESRD)', 'Janssen / Amgen', 'Pre-medication', ARRAY['Kidney'], 'https://www.jnjwithme.com/'),
('aranesp', 'Aranesp', 'Darbepoetin Alfa', NULL, 'Anemia (ESRD)', 'Amgen', 'Pre-medication', ARRAY['Kidney'], 'https://www.amgensupportplus.com/'),
('mircera', 'Mircera', 'Methoxy Polyethylene Glycol-Epoetin Beta', NULL, 'Anemia (ESRD)', 'Vifor Pharma', 'Pre-medication', ARRAY['Kidney'], 'https://www.cslvifor.com/'),

-- Iron Supplements (ESRD)
('venofer', 'Venofer', 'Iron Sucrose', NULL, 'Iron Supplement (ESRD)', 'American Regent', 'Pre-medication', ARRAY['Kidney'], 'https://www.venofer.com/venaccess'),
('feraheme', 'Feraheme', 'Ferumoxytol', NULL, 'Iron Supplement (ESRD)', 'AMAG', 'Pre-medication', ARRAY['Kidney'], 'https://www.feraheme.com/support'),
('injectafer', 'Injectafer', 'Ferric Carboxymaltose', NULL, 'Iron Supplement (ESRD)', 'American Regent', 'Pre-medication', ARRAY['Kidney'], 'https://www.dsiaccesscentral.com/'),

-- Vitamin D (ESRD)
('calcitriol', 'Rocaltrol / Calcijex', 'Calcitriol', NULL, 'Vitamin D (ESRD)', 'Generic', 'Pre-medication', ARRAY['Kidney'], NULL),
('zemplar', 'Zemplar', 'Paricalcitol', NULL, 'Vitamin D (ESRD)', 'AbbVie', 'Pre-medication', ARRAY['Kidney'], 'https://www.abbvie.com/patients/patient-assistance.html'),
('hectorol', 'Hectorol', 'Doxercalciferol', NULL, 'Vitamin D (ESRD)', 'Sanofi', 'Pre-medication', ARRAY['Kidney'], 'https://www.sanofipatientconnection.com/'),

-- Hyperparathyroidism (ESRD)
('sensipar', 'Sensipar', 'Cinacalcet', NULL, 'Hyperparathyroidism (ESRD)', 'Amgen', 'Pre-medication', ARRAY['Kidney'], 'https://www.amgensupportplus.com/'),
('parsabiv', 'Parsabiv', 'Etelcalcetide', NULL, 'Hyperparathyroidism (ESRD)', 'Amgen', 'Pre-medication', ARRAY['Kidney'], 'https://www.amgensupportplus.com/'),

-- Phosphate Binders (ESRD)
('auryxia', 'Auryxia', 'Ferric Citrate', NULL, 'Phosphate Binder (ESRD)', 'Akebia', 'Pre-medication', ARRAY['Kidney'], 'https://www.akebiacares.com/'),
('phoslo', 'PhosLo', 'Calcium Acetate', NULL, 'Phosphate Binder (ESRD)', 'Generic', 'Pre-medication', ARRAY['Kidney'], NULL),

-- Acute Rejection
('campath', 'Campath / Lemtrada', 'Alemtuzumab', NULL, 'Acute Rejection', 'Sanofi', 'Post-medication', ARRAY['Kidney','Liver','Heart'], 'https://www.sanofipatientconnection.com/'),
('rituxan', 'Rituxan', 'Rituximab', NULL, 'Acute Rejection', 'Genentech', 'Post-medication', ARRAY['Kidney','Liver','Heart'], 'https://www.genentech-access.com/patient.html'),
('ivig', 'Gammagard / Privigen / Octagam', 'Intravenous Immunoglobulin (IVIG)', NULL, 'Acute Rejection', 'Various', 'Post-medication', ARRAY['Kidney','Liver','Heart','Lung'], 'https://www.gammagard.com/primary-immunodeficiency/copay-support'),

-- Antibody-Mediated Rejection
('soliris', 'Soliris', 'Eculizumab', NULL, 'Antibody-Mediated Rejection', 'Alexion', 'Post-medication', ARRAY['Kidney'], 'https://alexion.com/our-patients'),
('ultomiris', 'Ultomiris', 'Ravulizumab', NULL, 'Antibody-Mediated Rejection', 'Alexion', 'Post-medication', ARRAY['Kidney'], 'https://alexion.com/our-patients'),

-- ACE Inhibitors
('lisinopril', 'Prinivil / Zestril', 'Lisinopril', '29046', 'ACE Inhibitor', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Kidney','Liver'], NULL),
('enalapril', 'Vasotec', 'Enalapril', NULL, 'ACE Inhibitor', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Kidney'], NULL),
('ramipril', 'Altace', 'Ramipril', NULL, 'ACE Inhibitor', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Kidney'], NULL),

-- ARBs
('losartan', 'Cozaar', 'Losartan', NULL, 'ARB', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Kidney'], NULL),
('valsartan', 'Diovan', 'Valsartan', NULL, 'ARB', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Kidney'], NULL),
('olmesartan', 'Benicar', 'Olmesartan', NULL, 'ARB', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Kidney'], NULL),
('irbesartan', 'Avapro', 'Irbesartan', NULL, 'ARB', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Kidney'], NULL),

-- Calcium Channel Blockers
('amlodipine', 'Norvasc', 'Amlodipine', '17767', 'Calcium Channel Blocker', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Kidney'], NULL),
('diltiazem', 'Cardizem', 'Diltiazem', NULL, 'Calcium Channel Blocker', 'Generic', 'Both (Pre & Post)', ARRAY['Heart'], NULL),
('nifedipine', 'Procardia / Adalat', 'Nifedipine', NULL, 'Calcium Channel Blocker', 'Generic', 'Both (Pre & Post)', ARRAY['Heart'], NULL),

-- Statins
('atorvastatin', 'Lipitor', 'Atorvastatin', '83367', 'Statin', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Liver','Kidney','Pancreas'], NULL),
('simvastatin', 'Zocor', 'Simvastatin', NULL, 'Statin', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Liver','Kidney'], NULL),
('rosuvastatin', 'Crestor', 'Rosuvastatin', NULL, 'Statin', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Liver','Kidney'], NULL),
('pravastatin', 'Pravachol', 'Pravastatin', '42463', 'Statin', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Liver'], NULL),
('lovastatin', 'Mevacor', 'Lovastatin', NULL, 'Statin', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Liver'], NULL),

-- Antiplatelets
('clopidogrel', 'Plavix', 'Clopidogrel', NULL, 'Antiplatelet', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Kidney','Liver'], NULL),
('aspirin', 'Ecotrin / Bayer', 'Aspirin', '1191', 'Antiplatelet', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Kidney','Liver','Pancreas'], NULL),

-- Anticoagulants
('warfarin', 'Coumadin', 'Warfarin', NULL, 'Anticoagulant', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Lung','Liver'], NULL),
('apixaban', 'Eliquis', 'Apixaban', NULL, 'Anticoagulant', 'Bristol Myers Squibb', 'Both (Pre & Post)', ARRAY['Heart','Kidney'], 'https://www.bmsaccesssupport.bmscustomerconnect.com/'),
('rivaroxaban', 'Xarelto', 'Rivaroxaban', NULL, 'Anticoagulant', 'Janssen', 'Both (Pre & Post)', ARRAY['Heart','Kidney'], 'https://www.jnjwithme.com/'),

-- Cardiac Glycoside
('digoxin', 'Lanoxin', 'Digoxin', NULL, 'Cardiac Glycoside', 'Generic', 'Both (Pre & Post)', ARRAY['Heart'], NULL),

-- Diabetes
('metformin', 'Glucophage', 'Metformin', NULL, 'Diabetes', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Pancreas'], NULL),
('glipizide', 'Glucotrol', 'Glipizide', NULL, 'Diabetes', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Pancreas'], NULL),
('glyburide', 'DiaBeta / Glynase', 'Glyburide', NULL, 'Diabetes', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Pancreas'], NULL),
('glimepiride', 'Amaryl', 'Glimepiride', NULL, 'Diabetes', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Pancreas'], NULL),
('sitagliptin', 'Januvia', 'Sitagliptin', NULL, 'Diabetes', 'Merck', 'Both (Pre & Post)', ARRAY['Kidney','Pancreas'], 'https://www.merckhelps.com/'),
('semaglutide', 'Ozempic / Wegovy', 'Semaglutide', NULL, 'Diabetes', 'Novo Nordisk', 'Both (Pre & Post)', ARRAY['Kidney','Heart','Pancreas'], 'https://www.novocare.com/'),
('dulaglutide', 'Trulicity', 'Dulaglutide', NULL, 'Diabetes', 'Lilly', 'Both (Pre & Post)', ARRAY['Kidney','Heart','Pancreas'], 'https://www.lillycares.com/'),

-- Insulin
('insulin-glargine', 'Lantus / Basaglar', 'Insulin Glargine', NULL, 'Insulin', 'Sanofi / Lilly', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Pancreas'], 'https://www.sanofipatientconnection.com/'),
('insulin-lispro', 'Humalog', 'Insulin Lispro', NULL, 'Insulin', 'Lilly', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Pancreas'], 'https://www.lillycares.com/'),
('insulin-aspart', 'Novolog', 'Insulin Aspart', NULL, 'Insulin', 'Novo Nordisk', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Pancreas'], 'https://www.novocare.com/'),

-- Thyroid
('levothyroxine', 'Synthroid / Levoxyl', 'Levothyroxine', NULL, 'Thyroid', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Kidney','Liver','Lung','Pancreas'], NULL),
('liothyronine', 'Cytomel', 'Liothyronine', NULL, 'Thyroid', 'Generic', 'Both (Pre & Post)', ARRAY['Heart','Kidney','Liver'], NULL),

-- Bronchodilators
('albuterol', 'ProAir / Ventolin / Proventil', 'Albuterol', NULL, 'Bronchodilator', 'Generic', 'Both (Pre & Post)', ARRAY['Lung','Heart'], NULL),
('tiotropium', 'Spiriva', 'Tiotropium', NULL, 'Bronchodilator', 'Boehringer Ingelheim', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.boehringer-ingelheim.com/us/patient-assistance'),
('levalbuterol', 'Xopenex', 'Levalbuterol', NULL, 'Bronchodilator', 'Sunovion', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.sunovion.com/patient-support'),
('ipratropium', 'Atrovent', 'Ipratropium', NULL, 'Bronchodilator', 'Boehringer Ingelheim', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.boehringer-ingelheim.com/us/patient-assistance'),
('ipratropium-albuterol', 'Combivent / DuoNeb', 'Ipratropium/Albuterol', NULL, 'Bronchodilator', 'Boehringer Ingelheim', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.boehringer-ingelheim.com/us/patient-assistance'),
('umeclidinium-vilanterol', 'Anoro Ellipta', 'Umeclidinium/Vilanterol', NULL, 'Bronchodilator', 'GlaxoSmithKline', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.gskforyou.com/'),

-- Respiratory
('fluticasone-salmeterol', 'Advair', 'Fluticasone/Salmeterol', NULL, 'Respiratory', 'GlaxoSmithKline', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.gskforyou.com/'),
('budesonide-formoterol', 'Symbicort', 'Budesonide/Formoterol', NULL, 'Respiratory', 'AstraZeneca', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.azandmeapp.com/'),
('montelukast', 'Singulair', 'Montelukast', NULL, 'Respiratory', 'Generic', 'Both (Pre & Post)', ARRAY['Lung'], NULL),
('fluticasone-vilanterol', 'Breo Ellipta', 'Fluticasone/Vilanterol', NULL, 'Respiratory', 'GlaxoSmithKline', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.gskforyou.com/'),
('mometasone-formoterol', 'Dulera', 'Mometasone/Formoterol', NULL, 'Respiratory', 'Organon', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.organonhelps.com/'),

-- Inhaled Corticosteroids
('fluticasone', 'Flovent', 'Fluticasone', NULL, 'Inhaled Corticosteroid', 'GlaxoSmithKline', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.gskforyou.com/'),
('budesonide-inhaled', 'Pulmicort', 'Budesonide', NULL, 'Inhaled Corticosteroid', 'AstraZeneca', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.azandmeapp.com/'),
('beclomethasone', 'QVAR', 'Beclomethasone', NULL, 'Inhaled Corticosteroid', 'Teva', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.tevausa.com/patient-resources/'),
('mometasone-inhaled', 'Asmanex', 'Mometasone', NULL, 'Inhaled Corticosteroid', 'Organon', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.organonhelps.com/'),
('ciclesonide', 'Alvesco', 'Ciclesonide', NULL, 'Inhaled Corticosteroid', 'Sunovion', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.sunovion.com/patient-support'),

-- Asthma Biologics
('omalizumab', 'Xolair', 'Omalizumab', NULL, 'Asthma Biologic', 'Genentech / Novartis', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.genentech-access.com/patient.html'),
('mepolizumab', 'Nucala', 'Mepolizumab', NULL, 'Asthma Biologic', 'GlaxoSmithKline', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.gskforyou.com/'),
('benralizumab', 'Fasenra', 'Benralizumab', NULL, 'Asthma Biologic', 'AstraZeneca', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.azandmeapp.com/'),
('dupilumab', 'Dupixent', 'Dupilumab', NULL, 'Asthma Biologic / Allergy', 'Regeneron / Sanofi', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.dupixent.com/support-savings/dupixent-my-way'),
('tezepelumab', 'Tezspire', 'Tezepelumab', NULL, 'Asthma Biologic', 'AstraZeneca', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.azandmeapp.com/'),

-- Leukotriene Modifiers
('zafirlukast', 'Accolate', 'Zafirlukast', NULL, 'Leukotriene Modifier', 'Generic', 'Both (Pre & Post)', ARRAY['Lung'], NULL),
('zileuton', 'Zyflo', 'Zileuton', NULL, 'Leukotriene Modifier', 'Generic', 'Both (Pre & Post)', ARRAY['Lung'], NULL),

-- Antihistamines
('cetirizine', 'Zyrtec', 'Cetirizine', NULL, 'Antihistamine', 'Generic', 'Both (Pre & Post)', ARRAY['Lung','Kidney'], NULL),
('loratadine', 'Claritin', 'Loratadine', NULL, 'Antihistamine', 'Generic', 'Both (Pre & Post)', ARRAY['Lung','Kidney'], NULL),
('fexofenadine', 'Allegra', 'Fexofenadine', NULL, 'Antihistamine', 'Generic', 'Both (Pre & Post)', ARRAY['Lung','Kidney'], NULL),
('levocetirizine', 'Xyzal', 'Levocetirizine', NULL, 'Antihistamine', 'Generic', 'Both (Pre & Post)', ARRAY['Lung','Kidney'], NULL),
('desloratadine', 'Clarinex', 'Desloratadine', NULL, 'Antihistamine', 'Generic', 'Both (Pre & Post)', ARRAY['Lung','Kidney'], NULL),

-- Nasal Corticosteroids
('fluticasone-nasal', 'Flonase', 'Fluticasone Nasal', NULL, 'Nasal Corticosteroid', 'GlaxoSmithKline', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.gskforyou.com/'),
('mometasone-nasal', 'Nasonex', 'Mometasone Nasal', NULL, 'Nasal Corticosteroid', 'Organon', 'Both (Pre & Post)', ARRAY['Lung'], 'https://www.organonhelps.com/'),
('triamcinolone-nasal', 'Nasacort', 'Triamcinolone Nasal', NULL, 'Nasal Corticosteroid', 'Generic', 'Both (Pre & Post)', ARRAY['Lung'], NULL),

-- Nasal Antihistamines
('azelastine-nasal', 'Astelin / Astepro', 'Azelastine Nasal', NULL, 'Nasal Antihistamine', 'Generic', 'Both (Pre & Post)', ARRAY['Lung'], NULL),
('olopatadine-nasal', 'Patanase', 'Olopatadine Nasal', NULL, 'Nasal Antihistamine', 'Generic', 'Both (Pre & Post)', ARRAY['Lung'], NULL),

-- Mast Cell Stabilizer
('cromolyn', 'NasalCrom', 'Cromolyn Sodium', NULL, 'Mast Cell Stabilizer', 'Generic', 'Both (Pre & Post)', ARRAY['Lung'], NULL),

-- Pain Relief
('tramadol', 'Ultram', 'Tramadol', NULL, 'Pain Relief', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], NULL),
('hydrocodone-acetaminophen', 'Norco / Vicodin', 'Hydrocodone/Acetaminophen', NULL, 'Pain Relief', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], NULL),
('oxycodone', 'OxyContin / Roxicodone', 'Oxycodone', NULL, 'Pain Relief', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], NULL),

-- Nerve Pain
('gabapentin', 'Neurontin', 'Gabapentin', NULL, 'Nerve Pain', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], NULL),
('pregabalin', 'Lyrica', 'Pregabalin', NULL, 'Nerve Pain', 'Pfizer', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart'], 'https://www.pfizerrxpathways.com/'),

-- NSAIDs
('meloxicam', 'Mobic', 'Meloxicam', NULL, 'NSAID', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver'], NULL),
('ibuprofen', 'Motrin / Advil', 'Ibuprofen', NULL, 'NSAID', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver'], NULL),
('naproxen', 'Naprosyn / Aleve', 'Naproxen', NULL, 'NSAID', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver'], NULL),

-- Antidepressants
('sertraline', 'Zoloft', 'Sertraline', NULL, 'Antidepressant', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], NULL),
('escitalopram', 'Lexapro', 'Escitalopram', NULL, 'Antidepressant', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Lung','Pancreas'], NULL),
('fluoxetine', 'Prozac', 'Fluoxetine', NULL, 'Antidepressant', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Lung'], NULL),
('citalopram', 'Celexa', 'Citalopram', NULL, 'Antidepressant', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart'], NULL),
('duloxetine', 'Cymbalta', 'Duloxetine', NULL, 'Antidepressant', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart'], NULL),
('venlafaxine', 'Effexor', 'Venlafaxine', NULL, 'Antidepressant', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart'], NULL),
('bupropion', 'Wellbutrin / Zyban', 'Bupropion', NULL, 'Antidepressant', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart'], NULL),
('trazodone', 'Desyrel', 'Trazodone', NULL, 'Antidepressant/Sleep', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Lung'], NULL),

-- Anxiety
('alprazolam', 'Xanax', 'Alprazolam', NULL, 'Anxiety', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Lung'], NULL),
('lorazepam', 'Ativan', 'Lorazepam', NULL, 'Anxiety', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart'], NULL),
('clonazepam', 'Klonopin', 'Clonazepam', NULL, 'Anxiety', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart'], NULL),
('buspirone', 'BuSpar', 'Buspirone', NULL, 'Anxiety', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver'], NULL),

-- Sleep Aid
('zolpidem', 'Ambien', 'Zolpidem', NULL, 'Sleep Aid', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Lung'], NULL),

-- Antipsychotic
('quetiapine', 'Seroquel', 'Quetiapine', NULL, 'Antipsychotic', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart'], NULL),

-- Vitamins
('vitamin-d', 'Calciferol', 'Vitamin D', NULL, 'Vitamin', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart','Pancreas'], NULL),
('folic-acid', 'Folate', 'Folic Acid', NULL, 'Vitamin', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Liver','Heart'], NULL),

-- Gout
('allopurinol', 'Zyloprim', 'Allopurinol', NULL, 'Gout', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Heart'], NULL),
('colchicine', 'Colcrys', 'Colchicine', NULL, 'Gout', 'Generic', 'Both (Pre & Post)', ARRAY['Kidney','Heart'], NULL),

-- Fatty Liver Disease (NASH)
('vitamin-e', 'Aqua Gem-E / d-Alpha-Tocopherol', 'Vitamin E', NULL, 'Fatty Liver Disease (NASH)', 'Generic', 'Both (Pre & Post)', ARRAY['Liver'], NULL),
('pioglitazone', 'Actos', 'Pioglitazone', NULL, 'Fatty Liver Disease (NASH)', 'Takeda', 'Both (Pre & Post)', ARRAY['Liver','Kidney','Pancreas'], 'https://www.takeda.com/en-us/what-we-do/patient-services/'),
('resmetirom', 'Rezdiffra', 'Resmetirom', NULL, 'Fatty Liver Disease (NASH)', 'Madrigal', 'Both (Pre & Post)', ARRAY['Liver'], 'https://madrigalpatientsupport.com/')

ON CONFLICT (id) DO UPDATE SET
    brand_name = EXCLUDED.brand_name,
    generic_name = EXCLUDED.generic_name,
    rxcui = EXCLUDED.rxcui,
    category = EXCLUDED.category,
    manufacturer = EXCLUDED.manufacturer,
    stage = EXCLUDED.stage,
    common_organs = EXCLUDED.common_organs,
    pap_url = EXCLUDED.pap_url,
    updated_at = NOW();
