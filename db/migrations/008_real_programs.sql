-- Real Programs Migration
-- Adds actual assistance programs found on the site for tracking

-- ============================================
-- PAP (Patient Assistance Programs) - Manufacturer Programs
-- ============================================

-- Alexion (Soliris, Ultomiris)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('alexion-pap', 'pap', 'Alexion Patient Assistance', 'https://alexion.com/our-patients', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Madrigal (Rezdiffra)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('madrigal-pap', 'pap', 'Madrigal Patient Support', 'https://madrigalpatientsupport.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- United Therapeutics
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('united-therapeutics-pap', 'pap', 'United Therapeutics Cares', 'https://unitedtherapeuticscares.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- AbbVie
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('abbvie-pap', 'pap', 'AbbVie Patient Assistance', 'https://www.abbvie.com/patients/patient-assistance.html', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Bayer (Adempas)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('bayer-adempas-pap', 'pap', 'Adempas Aim Patient Support', 'https://www.adempas-us.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Amgen
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('amgen-pap', 'pap', 'Amgen SupportPlus', 'https://www.amgensupportplus.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Astellas (Prograf, Astagraf XL)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('astellas-pap', 'pap', 'Astellas Pharma Support Solutions', 'https://www.astellaspharmasupportsolutions.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Akebia (Auryxia)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('akebia-auryxia-pap', 'pap', 'AkebiaCares', 'https://www.akebiacares.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- AstraZeneca
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('astrazeneca-pap', 'pap', 'AZ&Me Patient Assistance', 'https://www.azandmeapp.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Bausch Health (Xifaxan)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('bausch-pap', 'pap', 'Bausch Health Patient Assistance', 'https://www.bauschhealthpap.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Bristol Myers Squibb (Nulojix, Orencia)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('bms-pap', 'pap', 'BMS Access Support', 'https://www.bmsaccesssupport.bmscustomerconnect.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Boehringer Ingelheim
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('boehringer-ingelheim-pap', 'pap', 'Boehringer Ingelheim Patient Assistance', 'https://www.boehringer-ingelheim.com/us/patient-assistance', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- AbbVie (Creon)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('abbvie-creon-pap', 'pap', 'CREON Complete', 'https://www.creoninfo.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- DSI (Dermatology)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('dsi-pap', 'pap', 'DSI Access Central', 'https://www.dsiaccesscentral.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Sanofi/Regeneron (Dupixent)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('sanofi-dupixent-pap', 'pap', 'Dupixent MyWay', 'https://www.dupixent.com/support-savings/dupixent-my-way', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- AMAG (Feraheme)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('amag-feraheme-pap', 'pap', 'Feraheme Support', 'https://www.feraheme.com/support', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Takeda (Gammagard)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('takeda-gammagard-pap', 'pap', 'Gammagard Copay Support', 'https://www.gammagard.com/primary-immunodeficiency/copay-support', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Genentech (CellCept, Valcyte)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('genentech-pap', 'pap', 'Genentech Access Solutions', 'https://www.genentech-access.com/patient.html', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Gilead
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('gilead-pap', 'pap', 'Gilead Advancing Access', 'https://www.gileadadvancingaccess.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Grifols
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('grifols-pap', 'pap', 'Grifols Patient Care Programs', 'https://www.grifolspatientcare.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- GSK
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('gsk-pap', 'pap', 'GSK For You', 'https://www.gskforyou.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Janssen (J&J)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('janssen-pap', 'pap', 'J&J withMe', 'https://www.jnjwithme.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Eli Lilly
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('lilly-pap', 'pap', 'Lilly Cares', 'https://www.lillycares.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Merck
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('merck-pap', 'pap', 'Merck Helps', 'https://www.merckhelps.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Novartis (Neoral, Myfortic, Simulect, Zortress)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('novartis-pap', 'pap', 'Novartis Patient Assistance', 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Novo Nordisk
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('novo-nordisk-pap', 'pap', 'NovoCare', 'https://www.novocare.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Organon
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('organon-pap', 'pap', 'Organon Helps', 'https://www.organonhelps.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Pfizer (Rapamune, ATGAM, Solu-Medrol)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('pfizer-pap', 'pap', 'Pfizer RxPathways', 'https://www.pfizerrxpathways.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Sanofi (Thymoglobulin)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('sanofi-pap', 'pap', 'Sanofi Patient Connection', 'https://www.sanofipatientconnection.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Sunovion
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('sunovion-pap', 'pap', 'Sunovion Patient Support', 'https://www.sunovion.com/patient-support', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Takeda
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('takeda-pap', 'pap', 'Takeda Patient Services', 'https://www.takeda.com/en-us/what-we-do/patient-services/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Teva
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('teva-pap', 'pap', 'Teva Patient Resources', 'https://www.tevausa.com/patient-resources/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- American Regent (Venofer)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('american-regent-venofer-pap', 'pap', 'Venofer VenAccess', 'https://www.venofer.com/venaccess', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Vifor Pharma
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('vifor-pap', 'pap', 'CSL Vifor Patient Support', 'https://www.cslvifor.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- ============================================
-- COPAY CARD PROGRAMS
-- ============================================

-- Xifaxan (Bausch Health)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('xifaxan-copay', 'copay', 'Xifaxan Copay Savings Program', 'https://xifaxan.copaysavingsprogram.com/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- ============================================
-- FOUNDATION PROGRAMS
-- ============================================

-- HealthWell Foundation (general)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('healthwell-general', 'foundation', 'HealthWell Foundation', 'https://www.healthwellfoundation.org', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- PAN Foundation FundFinder Tool
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('pan-fundfinder', 'foundation', 'PAN Foundation FundFinder', 'https://fundfinder.panfoundation.org/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- PAN Foundation (general)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('pan-general', 'foundation', 'PAN Foundation', 'https://www.panfoundation.org', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Patient Advocate Foundation
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('paf-general', 'foundation', 'Patient Advocate Foundation', 'https://www.patientadvocate.org', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Patient Services Inc (PSI)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('psi-general', 'foundation', 'Accessia Health', 'https://www.accessiahealth.org/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- NORD (National Organization for Rare Disorders)
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('nord-general', 'foundation', 'National Organization for Rare Disorders (NORD)', 'https://rarediseases.org/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;

-- Rx Outreach
INSERT INTO programs (program_id, program_type, name, official_url, active)
VALUES ('rxoutreach-general', 'foundation', 'Rx Outreach', 'https://rxoutreach.org/', true)
ON CONFLICT (program_id) DO UPDATE SET official_url = EXCLUDED.official_url, name = EXCLUDED.name;
