-- Fix Broken URLs Migration
-- Verified December 27, 2025
-- Updates broken and redirected PAP/program URLs

-- ============================================
-- PAP Programs Table Updates
-- ============================================

-- Grifols: 404 Not Found -> grifolspatientcare.com
UPDATE programs
SET official_url = 'https://www.grifolspatientcare.com/', name = 'Grifols Patient Care Programs'
WHERE program_id = 'grifols-pap';

-- Akebia/Auryxia: 404 Not Found -> akebiacares.com
UPDATE programs
SET official_url = 'https://www.akebiacares.com/', name = 'AkebiaCares'
WHERE program_id = 'akebia-auryxia-pap';

-- Organon: 404 Not Found -> organonhelps.com
UPDATE programs
SET official_url = 'https://www.organonhelps.com/', name = 'Organon Helps'
WHERE program_id = 'organon-pap';

-- CREON: Redirects to creoninfo.com
UPDATE programs
SET official_url = 'https://www.creoninfo.com/', name = 'CREON Complete'
WHERE program_id = 'abbvie-creon-pap';

-- Janssen CarePath: Redirects to jnjwithme.com
UPDATE programs
SET official_url = 'https://www.jnjwithme.com/', name = 'J&J withMe'
WHERE program_id = 'janssen-pap';

-- Amgen First Step: Redirects to amgensupportplus.com
UPDATE programs
SET official_url = 'https://www.amgensupportplus.com/', name = 'Amgen SupportPlus'
WHERE program_id = 'amgen-pap';

-- Vifor Pharma: Redirects to cslvifor.com (acquired by CSL)
UPDATE programs
SET official_url = 'https://www.cslvifor.com/', name = 'CSL Vifor Patient Support'
WHERE program_id = 'vifor-pap';

-- Adempas: Redirects to adempas-us.com
UPDATE programs
SET official_url = 'https://www.adempas-us.com/', name = 'Adempas Aim Patient Support'
WHERE program_id = 'bayer-adempas-pap';

-- Patient Services Inc: Rebranded to Accessia Health
UPDATE programs
SET official_url = 'https://www.accessiahealth.org/', name = 'Accessia Health'
WHERE program_id = 'psi-general';

-- ============================================
-- Medications Table Updates
-- ============================================

-- Update all medication PAP URLs
UPDATE medications SET pap_url = 'https://www.grifolspatientcare.com/'
WHERE pap_url = 'https://www.grifols.com/en/patient-support';

UPDATE medications SET pap_url = 'https://www.akebiacares.com/'
WHERE pap_url = 'https://www.auryxia.com/phosphate-binder/savings-support';

UPDATE medications SET pap_url = 'https://www.organonhelps.com/'
WHERE pap_url = 'https://www.organon.com/usa/patient-resources/';

UPDATE medications SET pap_url = 'https://www.creoninfo.com/'
WHERE pap_url = 'https://www.creon.com/savings-support';

UPDATE medications SET pap_url = 'https://www.jnjwithme.com/'
WHERE pap_url = 'https://www.janssencarepath.com/';

UPDATE medications SET pap_url = 'https://www.amgensupportplus.com/'
WHERE pap_url = 'https://www.amgenfirststep.com/';

UPDATE medications SET pap_url = 'https://www.cslvifor.com/'
WHERE pap_url = 'https://www.viforpharma.com/en/patient-support';

UPDATE medications SET pap_url = 'https://www.adempas-us.com/'
WHERE pap_url = 'https://www.adempas.com/savings-support';

-- ============================================
-- Savings Programs Table Updates
-- ============================================

-- Update savings_programs application URLs
UPDATE savings_programs SET application_url = 'https://www.jnjwithme.com/'
WHERE application_url LIKE '%janssencarepath%';

UPDATE savings_programs SET application_url = 'https://www.accessiahealth.org/'
WHERE application_url LIKE '%patientservicesinc%';

-- ============================================
-- Verification Comment
-- ============================================
-- All URLs verified as of December 27, 2025
-- 404 errors and permanent redirects have been updated
